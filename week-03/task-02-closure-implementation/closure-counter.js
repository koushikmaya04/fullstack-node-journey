
               //     Example -1



function outer(){
let count=0;
function inner(){
count++;
console.log(count);

}
return inner;
}
const counter = outer();
counter();
counter();
counter();

    // Basic closure  "One function remembers private data."