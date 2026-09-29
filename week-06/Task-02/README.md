# Week 06 - Task 02: Strategy and Adapter Patterns

## Objective

Practice two useful JavaScript design patterns by building small, real-world examples:

- Strategy Pattern
- Adapter Pattern

## 1. Strategy Pattern

The Strategy pattern allows an object to switch between different algorithms or behaviours without changing the main object.

In this exercise, `Checkout` can use different discount strategies:

- `NoDiscount`
- `PercentageDiscount`
- `FlatDiscount`

The checkout code does not need to know how each discount is calculated.

## 2. Adapter Pattern

The Adapter pattern allows incompatible interfaces to work together.

Here, the application expects:

`pay(amountInRupees)`

but the old payment gateway expects:

`makePayment(amountInPaise)`

`PaymentAdapter` converts the new interface into the format expected by the legacy gateway.

## Files

- `discount-strategies.js` - Strategy pattern implementation
- `payment-adapter.js` - Adapter pattern implementation
- `test.js` - Tests using Node.js built-in assertions

## Run

From the repository root:

```bash
node week-06/Task-02/test.js
```

Expected output:

```text
Week 06 Task 02: all tests passed.
```
