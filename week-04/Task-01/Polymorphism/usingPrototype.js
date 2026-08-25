// Parent
function Shape() {}

Shape.prototype.area = function () {
    return 0;
};

// Circle
function Circle(radius) {
    this.radius = radius;
}

Circle.prototype = Object.create(Shape.prototype);

Circle.prototype.area = function () {
    return Math.PI * this.radius * this.radius;
};

// Rectangle
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
}

Rectangle.prototype = Object.create(Shape.prototype);

Rectangle.prototype.area = function () {
    return this.width * this.height;
};

// Objects
const circle = new Circle(5);
const rectangle = new Rectangle(10, 5);

console.log(circle.area());     // 78.54
console.log(rectangle.area());  // 50