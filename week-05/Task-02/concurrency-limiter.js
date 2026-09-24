const { CustomPromise } = require("./custom-promise");

/**
 * Runs promise-returning task functions with a maximum number of tasks
 * executing at the same time.
 *
 * Tasks are functions rather than already-created Promises. This is important:
 * an already-created Promise has already started, so the queue could not
 * control its concurrency.
 *
 * @param {Array<Function>} tasks Functions that return a value or Promise.
 * @param {number} limit Maximum number of tasks running concurrently.
 * @returns {CustomPromise<Array>} Results in the same order as the input tasks.
 *
 * The queue is fail-fast: if one task rejects, the returned promise rejects.
 * Tasks that are already running are not cancelled because JavaScript Promises
 * do not provide general cancellation.
 */
function runWithConcurrency(tasks, limit = 3) {
  if (!Array.isArray(tasks)) {
    return CustomPromise.reject(new TypeError("tasks must be an array"));
  }

  if (!Number.isInteger(limit) || limit < 1) {
    return CustomPromise.reject(
      new RangeError("limit must be a positive integer"),
    );
  }

  for (const task of tasks) {
    if (typeof task !== "function") {
      return CustomPromise.reject(
        new TypeError("every task must be a function"),
      );
    }
  }

  if (tasks.length === 0) {
    return CustomPromise.resolve([]);
  }

  return new CustomPromise((resolve, reject) => {
    const results = new Array(tasks.length);
    let nextIndex = 0;
    let active = 0;
    let completed = 0;
    let stopped = false;

    const startNext = () => {
      if (stopped) return;

      if (completed === tasks.length) {
        resolve(results);
        return;
      }

      while (active < limit && nextIndex < tasks.length && !stopped) {
        const index = nextIndex;
        nextIndex += 1;
        active += 1;

        let taskResult;

        try {
          taskResult = tasks[index]();
        } catch (error) {
          stopped = true;
          reject(error);
          return;
        }

        CustomPromise.resolve(taskResult).then(
          (value) => {
            active -= 1;
            completed += 1;
            results[index] = value;
            startNext();
          },
          (error) => {
            stopped = true;
            reject(error);
          },
        );
      }
    };

    startNext();
  });
}

module.exports = {
  runWithConcurrency,
};
