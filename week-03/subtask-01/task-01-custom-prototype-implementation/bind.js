                //         Example -3
                // With parameters

                //  obj 1
let name = {
firstname: "koushik",
lastname: "Maya",
}
                //function parameters
let printFullName = function (city,state) {
console.log(this.firstname + " " + this.lastname + " from "+ city + ","+ state);
}

printFullName.call(name,"Hyderabad","Telangana");
               //  obj 2
let name2 = {
firstname: "Sachin",
lastname: "Tendulkar",
}
   
// doesnt directly invoke the function
// bind method gives the copy that can be invoked later 
// same as call 
let bindedcopy= printFullName.bind(name2,"Mumbai","Maharastra");
bindedcopy()