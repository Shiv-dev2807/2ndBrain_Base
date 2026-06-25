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