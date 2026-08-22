                                        // Bug


function test() {
    if (true) {
        var value = "First";
         console.log(value);
    }
    if (true) {
        var value = "Second";
         console.log(value);
    }
   
    
}
test();


                                        // Fix


// function test() {
//     if (true) {
//         let value = "First";
//         console.log(value);
//     }
//     if (true) {
//         let value = "Second";
//         console.log(value);
//     }
// }
// test();