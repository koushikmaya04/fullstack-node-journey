// Predict the output before running.

console.log("A");

Promise.resolve().then(() => {
    console.log("B");
    setTimeout(() => {
        console.log("C");
    }, 0);
});

setTimeout(() => {
    console.log("D");
    Promise.resolve().then(() => {
        console.log("E");
    });
}, 0);

console.log("F");

// Expected output:
// A
// F
// B
// D: first timer
// E: microtask from timer
// C: setTimeout from microtask
