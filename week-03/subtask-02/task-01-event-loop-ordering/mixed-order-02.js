// Predict the output before running.

console.log("A");

Promise.resolve().then(() => {
    console.log("B");
    setTimeout(() => {
        console.log("C: setTimeout from microtask");
    }, 0);
});

setTimeout(() => {
    console.log("D: first timer");
    Promise.resolve().then(() => {
        console.log("E: microtask from timer");
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
