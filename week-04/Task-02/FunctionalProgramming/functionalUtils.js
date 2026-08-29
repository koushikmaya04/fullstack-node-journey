// Functional Programming Utilities

/**
 * Create a curried version of a function.
 */
function curry(fn, arity = fn.length) {
  function curried(...args) {
    if (args.length >= arity) {
      return fn(...args);
    }

    return (...nextArgs) => curried(...args, ...nextArgs);
  }

  return curried;
}

/**
 * Compose functions from right to left.
 */
function compose(...functions) {
  return (initialValue) =>
    functions.reduceRight((value, fn) => fn(value), initialValue);
}

/**
 * Pipe functions from left to right.
 */
function pipe(...functions) {
  return (initialValue) =>
    functions.reduce((value, fn) => fn(value), initialValue);
}

/**
 * Return a deeply frozen copy without mutating the original object.
 */
function deepFreeze(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  const frozenCopy = Array.isArray(value) ? [] : {};
  seen.set(value, frozenCopy);

  Reflect.ownKeys(value).forEach((key) => {
    frozenCopy[key] = deepFreeze(value[key], seen);
  });

  return Object.freeze(frozenCopy);
}

module.exports = {
  curry,
  compose,
  pipe,
  deepFreeze,
};
