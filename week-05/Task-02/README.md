# Week 05 – Task 02: Async/Await, Combinators & Generators

## Main Task

1. Re-implement `Promise.all()`, `Promise.race()`, and `Promise.allSettled()` manually using the custom Promise implementation from Task 01.
2. Build an async task queue that runs N promises with a concurrency limit (for example, a maximum of 3 concurrent API calls).

## Files

- `promise-combinators.js` — Manual implementations of Promise combinators.
- `concurrency-limiter.js` — Async task queue with a configurable concurrency limit.
- `test.js` — Tests for the combinators and concurrency limiter.

## Testing

Run:

```bash
node week-05/Task-02/test.js
```

## Key Concepts

- `async/await`
- `Promise.all()`
- `Promise.race()`
- `Promise.allSettled()`
- Fail-fast vs fail-soft behavior
- Async task queues
- Concurrency limits
- Generators and iterators
