/**
 * CustomPromise
 *
 * A learning implementation of a Promise/A+ subset with:
 * - pending / fulfilled / rejected states
 * - then() chaining
 * - catch()
 * - finally()
 * - thenable / custom-promise adoption
 * - asynchronous handler execution
 */

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

const asyncRun = (fn) => {
  if (typeof queueMicrotask === "function") {
    queueMicrotask(fn);
  } else {
    setTimeout(fn, 0);
  }
};

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("A promise cannot resolve with itself"));
  }

  if (x instanceof CustomPromise) {
    return x.then(resolve, reject);
  }

  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    let then;
    let called = false;

    try {
      then = x.then;
    } catch (error) {
      return reject(error);
    }

    if (typeof then === "function") {
      try {
        then.call(
          x,
          (value) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, value, resolve, reject);
          },
          (reason) => {
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

  resolve(x);
}

class CustomPromise {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("Promise resolver is not a function");
    }

    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.handlers = [];

    const resolve = (value) => {
      if (this.state !== PENDING) return;
      this._resolve(value);
    };

    const reject = (reason) => {
      if (this.state !== PENDING) return;
      this.state = REJECTED;
      this.reason = reason;
      this._flushHandlers();
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  _resolve(value) {
    if (this.state !== PENDING) return;

    if (value === this) {
      this.state = REJECTED;
      this.reason = new TypeError("A promise cannot resolve with itself");
      this._flushHandlers();
      return;
    }

    if ((typeof value === "object" && value !== null) || typeof value === "function") {
      let then;

      try {
        then = value.then;
      } catch (error) {
        this._reject(error);
        return;
      }

      if (typeof then === "function") {
        let called = false;

        try {
          then.call(
            value,
            (nextValue) => {
              if (called) return;
              called = true;
              this._resolve(nextValue);
            },
            (reason) => {
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

    this.state = FULFILLED;
    this.value = value;
    this._flushHandlers();
  }

  _reject(reason) {
    if (this.state !== PENDING) return;
    this.state = REJECTED;
    this.reason = reason;
    this._flushHandlers();
  }

  _flushHandlers() {
    if (this.state === PENDING) return;

    const handlers = this.handlers;
    this.handlers = [];

    handlers.forEach((handler) => {
      asyncRun(() => this._runHandler(handler));
    });
  }

  _runHandler(handler) {
    const { onFulfilled, onRejected, nextResolve, nextReject, nextPromise } = handler;
    const callback = this.state === FULFILLED ? onFulfilled : onRejected;
    const settledValue = this.state === FULFILLED ? this.value : this.reason;

    if (typeof callback !== "function") {
      if (this.state === FULFILLED) {
        nextResolve(settledValue);
      } else {
        nextReject(settledValue);
      }
      return;
    }

    try {
      const result = callback(settledValue);
      resolvePromise(nextPromise, result, nextResolve, nextReject);
    } catch (error) {
      nextReject(error);
    }
  }

  then(onFulfilled, onRejected) {
    let nextResolve;
    let nextReject;

    const nextPromise = new CustomPromise((resolve, reject) => {
      nextResolve = resolve;
      nextReject = reject;
    });

    this.handlers.push({
      onFulfilled,
      onRejected,
      nextResolve,
      nextReject,
      nextPromise,
    });

    if (this.state !== PENDING) {
      this._flushHandlers();
    }

    return nextPromise;
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    const callback = typeof onFinally === "function" ? onFinally : () => undefined;

    return this.then(
      (value) => CustomPromise.resolve(callback()).then(() => value),
      (reason) => CustomPromise.resolve(callback()).then(() => {
        throw reason;
      }),
    );
  }

  static resolve(value) {
    if (value instanceof CustomPromise) return value;
    return new CustomPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new CustomPromise((_, reject) => reject(reason));
  }
}

module.exports = {
  CustomPromise,
  states: {
    PENDING,
    FULFILLED,
    REJECTED,
  },
};
