// Shape hierarchy demonstrating polymorphism

class Shape {
    area() {
        return 0;
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }

    area() {
        return Math.PI * this.radius * this.radius;
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    area() {
        return this.width * this.height;
    }
}

const circle = new Circle(5);
const rectangle = new Rectangle(10, 5);

console.log(circle.area());     // 78.54
console.log(rectangle.area());  // 50

const shapes = [circle, rectangle];
shapes.forEach(shape => console.log(shape.area()));
