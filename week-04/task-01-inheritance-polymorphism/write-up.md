# Week 4 Task 1 — Inheritance and Polymorphism

## Objectives

1. Implement classical inheritance using only prototypes, without the `class` keyword.
2. Re-implement the same inheritance relationship using ES6 classes and compare both approaches.
3. Build a small `Shape` hierarchy with `Circle` and `Rectangle` to demonstrate polymorphism through an `area()` method.

## Prototype Inheritance

The prototype version uses constructor functions. `Animal.call(this, name)` initializes the parent property, while `Dog.prototype = Object.create(Animal.prototype)` connects the child to the parent prototype.

## ES6 Class Inheritance

The ES6 version uses `class`, `extends`, and `super()`. The syntax is shorter and easier to read, while JavaScript still uses prototypes internally.

## Comparison

| Prototype approach | ES6 class approach |
| --- | --- |
| Constructor functions | `class` syntax |
| `Object.create()` | `extends` |
| `Parent.call()` | `super()` |
| More manual | Cleaner syntax |
| Prototype-based internally | Prototype-based internally |

## Polymorphism

`Circle` and `Rectangle` both extend `Shape` and override the `area()` method.

The same `shape.area()` call produces different results depending on the object:

- Circle with radius `5`: approximately `78.54`
- Rectangle with width `10` and height `5`: `50`

This demonstrates polymorphism because different objects respond to the same method in their own way.

## Files

- `prototype-inheritance.js`
- `es6-inheritance.js`
- `shape-polymorphism.js`
- `index.html`
- `write-up.md`
