"use strict"; // treat all JS code as newer version

//alert(3 + 4); // we are using node.js to run this code, so alert will not work.

let name = "John"; // string => use ""
let age = 25; // number => 2 to power 53, bigint => 2 to power 63
let isloggedIn = true; // boolean => true or false

//null => empty value
let emptyValue = null;

//undefined => value is not assigned
let undef = undefined;

//symbol => unique identifiers for objects
let id = Symbol("id");


//object => key-value pairs
let person = {
  name: "John",
  age: 25,
  isloggedIn: true,
};

console.log(typeof name); // string
console.log(typeof age); // number
console.log(typeof isloggedIn); // boolean
console.log(typeof emptyValue); // object => this is a bug in JS, null should be of type null
console.log(typeof undef); // undefined
console.log(typeof id); // symbol
console.log(typeof person); // object   

console.log(typeof "john"); // string