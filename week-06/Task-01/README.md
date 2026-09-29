# Week 06 - Task 01: Design Patterns in JavaScript

## Objective

Practice reusable JavaScript design patterns and module organization by building:

1. A custom EventEmitter using the Observer pattern.
2. A Singleton configuration manager.
3. A Factory for creating Email, SMS, and Push notification objects.

## Concepts

- CommonJS modules
- Module pattern
- Observer / PubSub
- Singleton
- Factory
- Closures
- `on`, `off`, `emit`, and `once`
- Encapsulation and private state

## Files

- `mini-event-emitter.js` - custom event emitter.
- `singleton-config.js` - singleton configuration manager.
- `notification-factory.js` - notification factory.
- `test.js` - built-in Node.js assertions covering the implementations.

## Run

```bash
node week-06/Task-01/test.js
```

The exercise intentionally uses Node's built-in `assert` module so it can run without installing a testing library.
