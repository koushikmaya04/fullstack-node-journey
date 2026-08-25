 // Parent
 function Animal(name) {
  this.name = name; 
} 
 Animal.prototype.speak = function () { 
 return this.name + " makes a sound"; 
}; 
//  Child 
function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed; 
 }
 // Inherit Animal methods 
 Dog.prototype = Object.create(Animal.prototype);
  // Dog's own method 
 Dog.prototype.bark = function () {
  return this.name + " barks"; 
  };
    // Create object 
 const dog = new Dog("Bruno", "Labrador"); 
 console.log(dog.speak());
 // Bruno makes a sound 
 console.log(dog.bark()); 
 // Bruno barks  