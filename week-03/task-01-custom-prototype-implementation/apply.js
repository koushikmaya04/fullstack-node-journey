// apply is similar to call . here we use an array list for passing parametrs


// example -1

let name1={
firstname:"koushik",
lastname:"maya"

}

let getName=function(city,state){
    console.log(this.firstname + " "+this.lastname + " from " +city +" "+ state);
    
}

getName.apply(name1,["Hyderabad","Telangana"])
let name2 ={
firstname:"luffy",
lastname:"Monkey"

}

getName.apply(name2,["onepiece","Anime"])