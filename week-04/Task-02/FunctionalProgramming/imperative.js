// Imperative version: loops + mutation

const orders = [
  { customer: "Asha", amount: 1200, status: "paid" },
  { customer: "Ravi", amount: 800, status: "pending" },
  { customer: "Maya", amount: 1600, status: "paid" },
  { customer: "Kiran", amount: 400, status: "paid" },
];

const paidOrders = [];
let total = 0;

for (let i = 0; i < orders.length; i += 1) {
  if (orders[i].status === "paid") {
    paidOrders.push(orders[i]);
    total += orders[i].amount;
  }
}

for (let i = 0; i < paidOrders.length; i += 1) {
  paidOrders[i].label = `${paidOrders[i].customer} - ₹${paidOrders[i].amount}`;
}

console.log("Paid orders:", paidOrders);
console.log("Total:", total);
