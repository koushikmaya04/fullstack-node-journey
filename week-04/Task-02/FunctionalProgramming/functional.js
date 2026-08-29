// Functional-style refactor using pure transformations.

const {
  compose,
  pipe,
  deepFreeze,
} = require("./functionalUtils");

const orders = deepFreeze([
  { customer: "Asha", amount: 1200, status: "paid" },
  { customer: "Ravi", amount: 800, status: "pending" },
  { customer: "Maya", amount: 1600, status: "paid" },
  { customer: "Kiran", amount: 400, status: "paid" },
]);

const isPaid = (order) => order.status === "paid";
const formatOrder = ({ customer, amount, status }) => ({
  customer,
  amount,
  status,
  label: `${customer} - ₹${amount}`,
});
const addAmounts = (total, { amount }) => total + amount;

const getPaidOrders = (items) => items.filter(isPaid).map(formatOrder);
const getTotal = (items) => items.reduce(addAmounts, 0);

const processOrders = pipe(
  getPaidOrders,
);

const formatCustomer = (order) => order.customer.toUpperCase();
const getFirstPaidCustomer = compose(formatCustomer, (items) => items[0]);

const paidOrders = processOrders(orders);
const total = getTotal(paidOrders);
const firstPaidCustomer = getFirstPaidCustomer(paidOrders);

console.log("Paid orders:", paidOrders);
console.log("Total:", total);
console.log("First paid customer:", firstPaidCustomer);
