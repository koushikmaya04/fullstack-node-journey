# Week 05 – Task 01: Custom Promise

## Main Task

Implement a custom Promise class from scratch (Promises/A+ subset) supporting:

- `pending`, `fulfilled`, and `rejected` states
- `then()`
- `catch()`
- `finally()`
- Promise chaining
- Thenable/custom Promise resolution
- Asynchronous-style handler execution
- Error propagation

## Files

- `custom-promise.js` — Custom Promise implementation
- `test.js` — Behavioral tests and comparisons with native `Promise`

## Implementation Notes

The implementation follows the core Promise/A+ resolution ideas:

1. A promise starts in the `pending` state.
2. It can settle only once, as either `fulfilled` or `rejected`.
3. `then()` always returns a new Promise, allowing chaining.
4. Returned values are resolved through the Promise Resolution Procedure, including thenables.
5. Exceptions thrown by handlers reject the next Promise in the chain.
6. Handlers run asynchronously using `queueMicrotask` when available, with `setTimeout` as a fallback.
7. `finally()` preserves the original fulfillment value/rejection reason unless the `finally` callback throws or returns a rejected Promise.

## Testing

Run:

```bash
node week-05/Task-01/test.js
```

The test suite checks both custom behavior and result parity with native `Promise` for representative scenarios.
