// ========================================
// Functional Utility Tests
// ========================================

const assert = require("assert");
const { curry, compose, pipe, deepFreeze } = require("./functionalUtils");

const addThree = (a, b, c) => a + b + c;
const curriedAddThree = curry(addThree);
assert.strictEqual(curriedAddThree(1)(2)(3), 6);
assert.strictEqual(curriedAddThree(1, 2)(3), 6);
assert.strictEqual(curriedAddThree(1)(2, 3), 6);

const double = (value) => value * 2;
const increment = (value) => value + 1;
assert.strictEqual(compose(double, increment)(3), 8);
assert.strictEqual(pipe(increment, double)(3), 8);

const original = {
    user: {
        name: "Koushik",
        settings: { theme: "dark" },
    },
    tags: ["js", "node"],
};

const frozen = deepFreeze(original);
assert.notStrictEqual(frozen, original);
assert(Object.isFrozen(frozen));
assert(Object.isFrozen(frozen.user));
assert(Object.isFrozen(frozen.user.settings));
assert(Object.isFrozen(frozen.tags));
assert.strictEqual(original.user.settings.theme, "dark");

console.log("All functional utility tests passed.");
