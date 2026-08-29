// ========================================
// Functional-Style Refactor
// ========================================

const { curry, compose, pipe, deepFreeze } = require("./functionalUtils");

const orders = deepFreeze([
    { customer: "Alice", amount: 120, paid: true },
    { customer: "Bob", amount: 80, paid: false },
    { customer: "Carol", amount: 200, paid: true },
]);

const isPaid = (order) => order.paid;
const getAmount = (order) => order.amount;
const add = (a, b) => a + b;
const formatSummary = curry((customer, amount) => `${customer}: $${amount}`);

const getSummary = (order) =>
    pipe(
        () => formatSummary(order.customer)(order.amount)
    )();

const paidOrders = orders.filter(isPaid);
const total = paidOrders.map(getAmount).reduce(add, 0);
const summaries = paidOrders.map(getSummary);

const addPrefix = (prefix) => (value) => `${prefix}${value}`;
const makeDisplayName = compose(
    addPrefix("Paid: "),
    (order) => `${order.customer} - $${order.amount}`
);

const displayNames = paidOrders.map(makeDisplayName);

console.log("Paid orders:", paidOrders);
console.log("Total:", total);
console.log("Summaries:", summaries);
console.log("Display names:", displayNames);
