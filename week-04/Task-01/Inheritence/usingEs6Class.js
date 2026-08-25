 class Animal {
 constructor(name) { 
this.name = name; 
}
 speak() { 
console.log(`${this.name} makes a sound`); 
}
 }
 class Dog extends Animal {
 constructor(name, breed) {
 super(name); 
this.breed = breed;
 } 
bark() {
 console.log(`${this.name} barks`); 
} 
}
 const dog2 = new Dog("Bruno", "Labrador");
 dog2.speak(); //Bruno makes a sound
 dog2.bark();  //Bruno barks
 console.log(dog2 instanceof Dog); // true
 console.log(dog2 instanceof Animal); // true