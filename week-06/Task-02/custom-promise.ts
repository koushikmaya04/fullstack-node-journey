export type PromiseState = "pending" | "fulfilled" | "rejected";

export interface ThenableLike<T> {
  then(
    onFulfilled?: (value: T) => unknown,
    onRejected?: (reason: unknown) => unknown,
  ): unknown;
}

interface Handler<T> {
  onFulfilled?: ((value: T) => unknown) | null;
  onRejected?: ((reason: unknown) => unknown) | null;
  nextResolve: (value: unknown) => void;
  nextReject: (reason: unknown) => void;
  nextPromise: CustomPromise<unknown>;
}

const asyncRun = (fn: () => void): void => {
  if (typeof queueMicrotask === "function") queueMicrotask(fn);
  else setTimeout(fn, 0);
};

function isObjectOrFunction(value: unknown): value is object | Function {
  return (typeof value === "object" && value !== null) || typeof value === "function";
}

function resolvePromise<T>(
  promise2: CustomPromise<T>,
  value: unknown,
  resolve: (value: T) => void,
  reject: (reason: unknown) => void,
): void {
  if (promise2 === value) {
    reject(new TypeError("A promise cannot resolve with itself"));
    return;
  }

  if (value instanceof CustomPromise) {
    value.then(resolve, reject);
    return;
  }

  if (isObjectOrFunction(value)) {
    let then: unknown;

    try {
      then = (value as { then?: unknown }).then;
    } catch (error) {
      reject(error);
      return;
    }

    if (typeof then === "function") {
      let called = false;

      try {
        (then as Function).call(
          value,
          (nextValue: unknown) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, nextValue, resolve, reject);
          },
          (reason: unknown) => {
            if (called) return;
            called = true;
            reject(reason);
          },
        );
      } catch (error) {
        if (!called) {
          called = true;
          reject(error);
        }
      }
      return;
    }
  }

  resolve(value as T);
}

export class CustomPromise<T> {
  private state: PromiseState = "pending";
  private value?: T;
  private reason?: unknown;
  private handlers: Handler<T>[] = [];

  constructor(
    executor: (
      resolve: (value: T | ThenableLike<T> | CustomPromise<T>) => void,
      reject: (reason?: unknown) => void,
    ) => void,
  ) {
    if (typeof executor !== "function") {
      throw new TypeError("Promise resolver is not a function");
    }

    const resolve = (value: T | ThenableLike<T> | CustomPromise<T>): void => {
      if (this.state !== "pending") return;
      this._resolve(value);
    };

    const reject = (reason?: unknown): void => {
      if (this.state !== "pending") return;
      this.state = "rejected";
      this.reason = reason;
      this._flushHandlers();
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  private _resolve(value: unknown): void {
    if (this.state !== "pending") return;

    if (value === this) {
      this._reject(new TypeError("A promise cannot resolve with itself"));
      return;
    }

    if (isObjectOrFunction(value)) {
      let then: unknown;

      try {
        then = (value as { then?: unknown }).then;
      } catch (error) {
        this._reject(error);
        return;
      }

      if (typeof then === "function") {
        let called = false;

        try {
          (then as Function).call(
            value,
            (nextValue: unknown) => {
              if (called) return;
              called = true;
              this._resolve(nextValue);
            },
            (reason: unknown) => {
              if (called) return;
              called = true;
              this._reject(reason);
            },
          );
        } catch (error) {
          if (!called) {
            called = true;
            this._reject(error);
          }
        }
        return;
      }
    }

    this.state = "fulfilled";
    this.value = value as T;
    this._flushHandlers();
  }

  private _reject(reason: unknown): void {
    if (this.state !== "pending") return;
    this.state = "rejected";
    this.reason = reason;
    this._flushHandlers();
  }

  private _flushHandlers(): void {
    if (this.state === "pending") return;

    const handlers = this.handlers;
    this.handlers = [];

    handlers.forEach((handler) => asyncRun(() => this._runHandler(handler)));
  }

  private _runHandler(handler: Handler<T>): void {
    const callback =
      this.state === "fulfilled" ? handler.onFulfilled : handler.onRejected;
    const settledValue = this.state === "fulfilled" ? this.value : this.reason;

    if (typeof callback !== "function") {
      if (this.state === "fulfilled") handler.nextResolve(settledValue);
      else handler.nextReject(settledValue);
      return;
    }

    try {
      const result = callback(settledValue as T);
      resolvePromise(handler.nextPromise, result, handler.nextResolve, handler.nextReject);
    } catch (error) {
      handler.nextReject(error);
    }
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | ThenableLike<TResult1>) | null,
    onRejected?: ((reason: unknown) => TResult2 | ThenableLike<TResult2>) | null,
  ): CustomPromise<TResult1 | TResult2> {
    let nextResolve!: (value: unknown) => void;
    let nextReject!: (reason: unknown) => void;

    const nextPromise = new CustomPromise<TResult1 | TResult2>((resolve, reject) => {
      nextResolve = resolve as (value: unknown) => void;
      nextReject = reject;
    });

    this.handlers.push({
      onFulfilled: onFulfilled as ((value: T) => unknown) | null | undefined,
      onRejected: onRejected as ((reason: unknown) => unknown) | null | undefined,
      nextResolve,
      nextReject,
      nextPromise: nextPromise as unknown as CustomPromise<unknown>,
    });

    if (this.state !== "pending") this._flushHandlers();

    return nextPromise;
  }

  catch<TResult = never>(
    onRejected: (reason: unknown) => TResult | ThenableLike<TResult>,
  ): CustomPromise<T | TResult> {
    return this.then(undefined, onRejected);
  }

  finally(onFinally?: () => unknown): CustomPromise<T> {
    const callback = typeof onFinally === "function" ? onFinally : () => undefined;

    return this.then(
      (value) => CustomPromise.resolve(callback()).then(() => value),
      (reason) => CustomPromise.resolve(callback()).then(() => {
        throw reason;
      }),
    ) as CustomPromise<T>;
  }

  static resolve<T>(value: T | CustomPromise<T>): CustomPromise<T> {
    if (value instanceof CustomPromise) return value;
    return new CustomPromise<T>((resolve) => resolve(value));
  }

  static reject<T = never>(reason: unknown): CustomPromise<T> {
    return new CustomPromise<T>((_, reject) => reject(reason));
  }
}
