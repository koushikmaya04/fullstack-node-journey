# Microtask vs Macrotask Ordering

## 1. Synchronous code runs first

JavaScript starts by executing the current synchronous code on the call stack.

## 2. Promise callbacks use the microtask queue

`Promise.resolve().then(...)` schedules its callback as a microtask. Microtasks run after the current synchronous code finishes and before the next macrotask.

## 3. `setTimeout` uses the macrotask queue

A `setTimeout(..., 0)` callback does not run immediately. It is scheduled as a task (commonly called a macrotask) and runs after the current stack and pending microtasks have been processed.

## Ordering

```text
┌──────────────────────┐
│ Synchronous code     │
│ Call Stack           │
└──────────┬───────────┘
           │ finishes
           ▼
┌──────────────────────┐
│ Microtask Queue      │
│ Promise.then(...)    │
└──────────┬───────────┘
           │ empty
           ▼
┌──────────────────────┐
│ Macrotask / Task     │
│ setTimeout(...)       │
└──────────────────────┘
```

### Simple rule

**Synchronous code → Microtasks → Macrotasks**

The important detail is that the microtask queue is drained before the event loop takes the next timer/task. A microtask created while a timer callback is running is therefore processed before another timer callback gets its turn.
