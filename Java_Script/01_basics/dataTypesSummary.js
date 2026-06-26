// Primitive

// 7 types of primitive data types in JavaScript : String, Number, BigInt, Boolean, undefined, Symbol, null, also float and double are considered as Number in JavaScript.

// Reference(Non-Primitive)
// Array, Object, Function, Date, RegExp, Map, Set, WeakMap, WeakSet
const id = Symbol("id");
const anotherId = Symbol("id");
console.log(id === anotherId); // false, coz Symbol is unique and immutable, even if they have the same description.


// =========================================

const heros = ["Superman", "Batman", "Spiderman"]//arrays reference //output: object

//object key-value pairs
let person = {
    name: "John",
    age: 30,
}

// functions are also objects in JavaScript

const greet = function() {
    console.log("Hello");
}

// =========================================

// typeof operator
console.log(typeof greet); // function
console.log(typeof heros); // object
console.log(typeof person); // object
console.log(typeof id); // symbol
console.log(typeof null); // object, this is a bug in JavaScript, null is a primitive data type but typeof returns object.

//Memories
// Stack(primitive types) and Heap(reference types)(non-primitive)


let name = "John"; // stored in stack memory
let anotherName = name; // stored in stack memory, anotherName is a copy of name

anotherName = "Doe"; // changing the value of anotherName, does not affect name

console.log(name); // John
console.log(anotherName); // Doe

let person1 = {
    name: "John",
    age: 30,
} // stored in heap memory

let anotherPerson = person1; // stored in stack memory, anotherPerson is a reference to person1

anotherPerson.age = 31; // changing the value of anotherPerson, affects person1

console.log(person1.age); // 31
console.log(anotherPerson.age); // 31

//ok so in sumamry, primitive data types are stored in stack memory and are immutable, while reference data types are stored in heap memory and are mutable.
//also means that stack sends a copy of the value to another variable, while heap sends a reference to the same object in memory.