// Classical inheritance using ES6 classes

class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        return `${this.name} makes a sound`;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }

    bark() {
        return `${this.name} barks`;
    }
}

const dog = new Dog("Bruno", "Labrador");

console.log(dog.speak()); // Bruno makes a sound
console.log(dog.bark());  // Bruno barks
console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true
