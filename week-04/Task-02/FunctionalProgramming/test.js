const assert = require("node:assert/strict");

const {
  curry,
  compose,
  pipe,
  deepFreeze,
} = require("./functionalUtils");

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

assert.equal(curriedAdd(1)(2)(3), 6);
assert.equal(curriedAdd(1, 2)(3), 6);
assert.equal(curriedAdd(1)(2, 3), 6);

const double = (value) => value * 2;
const increment = (value) => value + 1;

assert.equal(compose(double, increment)(3), 8);
assert.equal(pipe(increment, double)(3), 8);

const original = {
  user: {
    name: "Koushik",
    skills: ["Node.js", "JavaScript"],
  },
};

const frozen = deepFreeze(original);

assert.notEqual(frozen, original);
assert.equal(Object.isFrozen(frozen), true);
assert.equal(Object.isFrozen(frozen.user), true);
assert.equal(Object.isFrozen(frozen.user.skills), true);
assert.equal(original.user.name, "Koushik");

console.log("All functional utility tests passed.");
