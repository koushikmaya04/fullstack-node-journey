// this inside a object's method
                                    // Example -1
const student = {
name: "Akshay",
printName: function () {
console.log(this.name);
}
}
student.printName();

const student2 = {
name: "Deepika",
}
// function borrowing
student.printName.call(student2); 

// value of this = student2



//                                  // Example -2

//                 //  obj 1
// let name = {
// firstname: "Akshay",
// lastname: "Saini",
// }
//                 //function
// let printFullName = function () {
// console.log(this.firstname + " " + this. lastname);
// }

// printFullName.call(name);
//                //  obj 2
// let name2 = {
// firstname: "Sachin",
// lastname: "Tendulkar",
// }

// // function borrowing
// printFullName.call(name2);

          
                                 //Example -3
                //With parameters

                //  obj 1
// let name = {
// firstname: "koushik",
// lastname: "Maya",
// }
//                 //function parameters
// let printFullName = function (city,state) {
// console.log(this.firstname + " " + this.lastname + " from "+ city + ","+ state);
// }

// printFullName.call(name,"Hyderabad","Telangana");
//                //  obj 2
// let name2 = {
// firstname: "Sachin",
// lastname: "Tendulkar",
// }

// // function borrowing
// printFullName.call(name2,"Mumbai","Maharastra");