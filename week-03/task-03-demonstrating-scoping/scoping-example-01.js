for (var i = 0; i < 3; i++) {
    setTimeout(
        console.log(i)
    , 1000);
}
// output -- 3 3 3

//  Here the callbacks were created when the i =0 ,1 ,2 respectively but they are executed when i=3 

// Fix - use let


for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i);
    }, 1000);
}

//let creates a separate binding for each loop iteration 
// output -- 0 1 2