// ========================================
// Imperative Version
// ========================================

const orders = [
    { customer: "Alice", amount: 120, paid: true },
    { customer: "Bob", amount: 80, paid: false },
    { customer: "Carol", amount: 200, paid: true },
];

const paidOrders = [];
let total = 0;

for (let i = 0; i < orders.length; i += 1) {
    if (orders[i].paid) {
        paidOrders.push(orders[i]);
        total += orders[i].amount;
    }
}

for (let i = 0; i < paidOrders.length; i += 1) {
    paidOrders[i].summary = `${paidOrders[i].customer}: $${paidOrders[i].amount}`;
}

console.log("Paid orders:", paidOrders);
console.log("Total:", total);
