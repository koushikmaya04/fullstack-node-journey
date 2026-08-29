// ========================================
// Functional Utility Library
// ========================================

// Curry a function by collecting arguments until all parameters are supplied.
function curry(fn) {
    function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        }

        return (...nextArgs) => curried(...args, ...nextArgs);
    }

    return curried;
}

// Compose functions from right to left.
function compose(...functions) {
    return (value) => functions.reduceRight((result, fn) => fn(result), value);
}

// Pipe functions from left to right.
function pipe(...functions) {
    return (value) => functions.reduce((result, fn) => fn(result), value);
}

// Deeply freeze an object without mutating its structure.
function deepFreeze(value) {
    if (value === null || typeof value !== "object" || Object.isFrozen(value)) {
        return value;
    }

    const frozenCopy = Array.isArray(value)
        ? value.map(deepFreeze)
        : Object.fromEntries(
              Object.entries(value).map(([key, item]) => [key, deepFreeze(item)])
          );

    return Object.freeze(frozenCopy);
}

module.exports = {
    curry,
    compose,
    pipe,
    deepFreeze,
};
