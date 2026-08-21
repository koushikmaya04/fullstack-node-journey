                             // Example -2

function outer(){
let count=0;
function add(){
count++;
}

function sub(){
count--;
}

function print(){
    console.log(count)
}

return {
        add,
        sub,
        print
    };
}
const counter = outer();
counter.add();
counter.add();
counter.add();
counter.add();
counter.sub();
counter.print();

// "Multiple functions share and access private data."
// and here we cant access 
// counter.count()