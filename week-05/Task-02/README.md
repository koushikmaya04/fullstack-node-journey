# Week 05 – Task 02: Async/Await, Combinators & Generators

## Main Tasks

### 1. Manual Promise combinators

Re-implement these native Promise combinators using the custom Promise from Task 01:

- `Promise.all()`
- `Promise.race()`
- `Promise.allSettled()`

The implementations support values, native Promises, thenables, and `CustomPromise` instances.

### 2. Concurrency-limited async task queue

Implement an async task queue that accepts promise-returning functions and runs at most N tasks at the same time.

Example:

```js
const tasks = [
  () => fetchSomething(1),
  () => fetchSomething(2),
  () => fetchSomething(3),
  () => fetchSomething(4),
];

const results = await runWithConcurrency(tasks, 3);
```

The important detail is that tasks are functions. If Promises were created before passing them to the queue, they would already have started and the queue could not control concurrency.

## Files

- `promise-combinators.js` — manual implementations of `all`, `race`, and `allSettled`.
- `concurrency-limiter.js` — concurrency-limited async task queue.
- `test.js` — behavioral tests and comparisons with native Promise behavior.
- `../Task-01/custom-promise.js` — reused as the Promise implementation.

## Behavior

### customAll

- Preserves input order.
- Resolves when every input fulfills.
- Rejects as soon as an input rejects.
- Empty input resolves to `[]`.

### customRace

- Settles when the first input settles.
- The winner may be either fulfillment or rejection.
- Empty input remains pending, matching native `Promise.race()`.

### customAllSettled

- Waits for every input to settle.
- Never rejects because an input rejected.
- Returns `{ status, value/reason }` objects in input order.
- Empty input resolves to `[]`.

### runWithConcurrency

- Starts no more than `limit` tasks at once.
- Preserves result order.
- Starts additional tasks as earlier tasks settle.
- Rejects on the first task failure.
- Does not cancel tasks that are already running.

## Testing

Run:

```bash
node week-05/Task-02/test.js
```

The test suite verifies ordering, fulfillment/rejection behavior, empty inputs, concurrency limits, validation, fail-fast queue behavior, and representative parity with native Promise combinators.
