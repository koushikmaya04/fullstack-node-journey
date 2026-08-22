// Predict the output before running this script.

console.log("1: synchronous");

setTimeout(() => {
    console.log("2: setTimeout");
}, 0);

Promise.resolve().then(() => {
    console.log("3: Promise microtask");
});

console.log("4: synchronous");

// Expected output:
// 1: synchronous
// 4: synchronous
// 3: Promise microtask
// 2: setTimeout
