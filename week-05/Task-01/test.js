const assert = require("node:assert/strict");
const { CustomPromise } = require("./custom-promise");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function testStateAndAsyncHandlers() {
  let resolvePromise;
  const promise = new CustomPromise((resolve) => {
    resolvePromise = resolve;
  });

  assert.equal(promise.state, "pending");

  let sync = true;
  let callbackWasAsync = false;

  promise.then((value) => {
    callbackWasAsync = !sync;
    assert.equal(value, 42);
  });

  resolvePromise(42);
  assert.equal(promise.state, "fulfilled");
  sync = false;
  await wait(0);

  assert.equal(callbackWasAsync, true);
}

async function testRejectionAndCatch() {
  const error = new Error("boom");
  const result = await new CustomPromise((_, reject) => {
    reject(error);
  }).catch((reason) => reason.message);

  assert.equal(result, "boom");
}

async function testChaining() {
  const result = await new CustomPromise((resolve) => resolve(5))
    .then((value) => value * 2)
    .then((value) => new CustomPromise((resolve) => resolve(value + 10)));

  assert.equal(result, 20);
}

async function testErrorPropagation() {
  let reached = false;

  const result = await new CustomPromise((resolve) => resolve("start"))
    .then(() => {
      throw new Error("chain failed");
    })
    .then(() => {
      reached = true;
    })
    .catch((error) => error.message);

  assert.equal(result, "chain failed");
  assert.equal(reached, false);
}

async function testThenableAssimilation() {
  const thenable = {
    then(resolve) {
      setTimeout(() => resolve("thenable value"), 0);
    },
  };

  const result = await CustomPromise.resolve(thenable);
  assert.equal(result, "thenable value");
}

async function testFinallyOnFulfillmentAndRejection() {
  const events = [];

  const fulfilled = await CustomPromise.resolve("ok")
    .finally(() => {
      events.push("fulfilled finally");
    });

  assert.equal(fulfilled, "ok");

  const rejection = await CustomPromise.reject("failed")
    .finally(() => {
      events.push("rejected finally");
    })
    .catch((reason) => reason);

  assert.equal(rejection, "failed");
  assert.deepEqual(events, ["fulfilled finally", "rejected finally"]);
}

async function testFinallyErrorOverridesResult() {
  const result = await CustomPromise.resolve("value")
    .finally(() => {
      throw new Error("finally failed");
    })
    .catch((error) => error.message);

  assert.equal(result, "finally failed");
}

async function compareNativePromiseBehavior() {
  const scenarios = [
    {
      name: "basic chaining",
      custom: () => CustomPromise.resolve(3).then((value) => value + 4),
      native: () => Promise.resolve(3).then((value) => value + 4),
    },
    {
      name: "recovery",
      custom: () => CustomPromise.reject("failure").catch(() => "recovered"),
      native: () => Promise.reject("failure").catch(() => "recovered"),
    },
    {
      name: "finally preservation",
      custom: () => CustomPromise.resolve("kept").finally(() => undefined),
      native: () => Promise.resolve("kept").finally(() => undefined),
    },
  ];

  for (const scenario of scenarios) {
    const [customResult, nativeResult] = await Promise.all([
      scenario.custom(),
      scenario.native(),
    ]);

    assert.deepEqual(
      customResult,
      nativeResult,
      `${scenario.name}: custom result differs from native Promise`,
    );
  }
}

async function run() {
  await testStateAndAsyncHandlers();
  await testRejectionAndCatch();
  await testChaining();
  await testErrorPropagation();
  await testThenableAssimilation();
  await testFinallyOnFulfillmentAndRejection();
  await testFinallyErrorOverridesResult();
  await compareNativePromiseBehavior();

  console.log("All custom Promise tests passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
