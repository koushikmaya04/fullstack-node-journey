const { CustomPromise } = require("./custom-promise");

const isObjectOrFunction = (value) =>
  (typeof value === "object" && value !== null) || typeof value === "function";

function toCustomPromise(value) {
  if (value instanceof CustomPromise) return value;
  return CustomPromise.resolve(value);
}

/**
 * A manual implementation of Promise.all().
 *
 * - Preserves input order.
 * - Resolves only after every item fulfills.
 * - Rejects as soon as one item rejects.
 * - Accepts values, native Promises, thenables, and CustomPromises.
 */
function customAll(iterable) {
  return new CustomPromise((resolve, reject) => {
    let items;

    try {
      items = Array.from(iterable);
    } catch (error) {
      reject(error);
      return;
    }

    if (items.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(items.length);
    let remaining = items.length;

    items.forEach((item, index) => {
      toCustomPromise(item).then(
        (value) => {
          results[index] = value;
          remaining -= 1;

          if (remaining === 0) {
            resolve(results);
          }
        },
        reject,
      );
    });
  });
}

/**
 * A manual implementation of Promise.race().
 *
 * The first input to settle (fulfill or reject) settles the returned promise.
 * An empty iterable remains pending, matching native Promise.race().
 */
function customRace(iterable) {
  return new CustomPromise((resolve, reject) => {
    let items;

    try {
      items = Array.from(iterable);
    } catch (error) {
      reject(error);
      return;
    }

    items.forEach((item) => {
      toCustomPromise(item).then(resolve, reject);
    });
  });
}

/**
 * A manual implementation of Promise.allSettled().
 *
 * Waits for every input to settle and never rejects because of an input
 * rejection. The output order matches the input order.
 */
function customAllSettled(iterable) {
  return new CustomPromise((resolve, reject) => {
    let items;

    try {
      items = Array.from(iterable);
    } catch (error) {
      reject(error);
      return;
    }

    if (items.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(items.length);
    let remaining = items.length;

    items.forEach((item, index) => {
      toCustomPromise(item).then(
        (value) => {
          results[index] = { status: "fulfilled", value };
          remaining -= 1;

          if (remaining === 0) {
            resolve(results);
          }
        },
        (reason) => {
          results[index] = { status: "rejected", reason };
          remaining -= 1;

          if (remaining === 0) {
            resolve(results);
          }
        },
      );
    });
  });
}

module.exports = {
  customAll,
  customRace,
  customAllSettled,
};
