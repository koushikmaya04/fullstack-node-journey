const assert = require("node:assert/strict");
const { CustomPromise } = require("./custom-promise");
const {
  customAll,
  customRace,
  customAllSettled,
} = require("./promise-combinators");
const { runWithConcurrency } = require("./concurrency-limiter");

const delay = (ms, value, shouldReject = false) =>
  new Promise((resolve, reject) => {
    setTimeout(
      () => (shouldReject ? reject(value) : resolve(value)),
      ms,
    );
  });

async function testCustomAll() {
  const result = await customAll([
    delay(30, "first"),
    CustomPromise.resolve("second"),
    "third",
  ]);

  assert.deepEqual(result, ["first", "second", "third"]);
  assert.deepEqual(await customAll([]), []);

  await assert.rejects(
    async () => customAll([delay(5, "ok"), delay(1, "boom", true)]),
    (error) => error === "boom",
  );
}

async function testCustomRace() {
  const result = await customRace([
    delay(30, "slow"),
    delay(5, "fast"),
  ]);

  assert.equal(result, "fast");

  await assert.rejects(
    async () => customRace([delay(5, "failure", true), delay(30, "success")]),
    (error) => error === "failure",
  );
}

async function testCustomAllSettled() {
  const result = await customAllSettled([
    delay(5, "ok"),
    delay(1, "bad", true),
    42,
  ]);

  assert.deepEqual(result, [
    { status: "fulfilled", value: "ok" },
    { status: "rejected", reason: "bad" },
    { status: "fulfilled", value: 42 },
  ]);

  assert.deepEqual(await customAllSettled([]), []);
}

async function testConcurrencyLimit() {
  let active = 0;
  let maxActive = 0;

  const tasks = Array.from({ length: 8 }, (_, index) => () => {
    active += 1;
    maxActive = Math.max(maxActive, active);

    return delay(10, index).finally(() => {
      active -= 1;
    });
  });

  const results = await runWithConcurrency(tasks, 3);

  assert.deepEqual(results, [0, 1, 2, 3, 4, 5, 6, 7]);
  assert.equal(maxActive, 3);
}

async function testConcurrencyValidation() {
  await assert.rejects(
    async () => runWithConcurrency([], 0),
    RangeError,
  );

  await assert.rejects(
    async () => runWithConcurrency([1], 2),
    TypeError,
  );
}

async function testConcurrencyFailure() {
  let started = 0;

  const tasks = [
    () => {
      started += 1;
      return delay(5, "failed", true);
    },
    () => {
      started += 1;
      return delay(20, "later");
    },
    () => {
      started += 1;
      return "should not start after failure";
    },
  ];

  await assert.rejects(
    async () => runWithConcurrency(tasks, 2),
    (error) => error === "failed",
  );

  // The first two tasks were allowed to start. The third must never start.
  assert.equal(started, 2);
}

async function compareWithNative() {
  const nativeAll = await Promise.all([
    Promise.resolve(1),
    delay(2, 2),
    3,
  ]);
  const customAllResult = await customAll([
    CustomPromise.resolve(1),
    delay(2, 2),
    3,
  ]);
  assert.deepEqual(customAllResult, nativeAll);

  const nativeSettled = await Promise.allSettled([
    Promise.resolve("ok"),
    Promise.reject("bad"),
  ]);
  const customSettled = await customAllSettled([
    CustomPromise.resolve("ok"),
    CustomPromise.reject("bad"),
  ]);
  assert.deepEqual(customSettled, nativeSettled);

  const nativeRace = await Promise.race([
    delay(2, "winner"),
    delay(20, "loser"),
  ]);
  const customRaceResult = await customRace([
    delay(2, "winner"),
    delay(20, "loser"),
  ]);
  assert.equal(customRaceResult, nativeRace);
}

async function run() {
  await testCustomAll();
  await testCustomRace();
  await testCustomAllSettled();
  await testConcurrencyLimit();
  await testConcurrencyValidation();
  await testConcurrencyFailure();
  await compareWithNative();

  console.log("All Week 05 Task 02 tests passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
