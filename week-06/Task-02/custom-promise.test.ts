import { CustomPromise } from "./custom-promise";

describe("CustomPromise", () => {
  it("fulfills with a value", async () => {
    await new Promise<void>((done) => {
      new CustomPromise<number>((resolve) => resolve(42)).then((value) => {
        expect(value).toBe(42);
        done();
      });
    });
  });

  it("supports chaining", async () => {
    const result = await new Promise<number>((resolve, reject) => {
      new CustomPromise<number>((done) => done(10))
        .then((value) => value * 2)
        .then((value) => resolve(value + 5), reject);
    });
    expect(result).toBe(25);
  });

  it("catches executor errors", async () => {
    await new Promise<void>((done) => {
      new CustomPromise(() => {
        throw new Error("boom");
      }).catch((error) => {
        expect((error as Error).message).toBe("boom");
        done();
      });
    });
  });

  it("supports rejection and recovery", async () => {
    await new Promise<void>((done) => {
      CustomPromise.reject<string>("failed")
        .catch((reason) => {
          expect(reason).toBe("failed");
          return "recovered";
        })
        .then((value) => {
          expect(value).toBe("recovered");
          done();
        });
    });
  });

  it("adopts thenables", async () => {
    await new Promise<void>((done) => {
      new CustomPromise<number>((resolve) =>
        resolve({ then: (fulfill: (value: number) => void) => fulfill(7) }),
      ).then((value) => {
        expect(value).toBe(7);
        done();
      });
    });
  });

  it("runs finally before continuing", async () => {
    const calls: string[] = [];
    await new Promise<void>((done) => {
      CustomPromise.resolve("ok")
        .finally(() => calls.push("finally"))
        .then((value) => {
          expect(calls).toEqual(["finally"]);
          expect(value).toBe("ok");
          done();
        });
    });
  });

  it("supports static resolve and reject", async () => {
    await new Promise<void>((done) => {
      const existing = CustomPromise.resolve(100);
      expect(CustomPromise.resolve(existing)).toBe(existing);
      CustomPromise.reject("nope").catch((reason) => {
        expect(reason).toBe("nope");
        done();
      });
    });
  });
});
