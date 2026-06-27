/*

! <,>,<=,>=,==,!==,===,!==

if(){

}
else{

}
*/

//!shorthand
if (true) console.log("hi");


//!Not good practice
if(true) console.log("Not good"),
console.log("practice");


/*
!  if(){} else if(){} else{}
*/

if(true && true) console.log("&&"); // && both conditions must be true
if(true || true) console.log("||"); // || any one condition must be true




// Nullish Coalescing Operator (??) : null undefined
//check safety from null & undefined
//! Ex

let v = null ?? 5131
console.log(v);

//same for undefined

let c = undefined ?? 1234
console.log(c);


let aa = null ?? 1231 ?? 1111 //first non null or undefined value is taken
console.log(aa);


//Ternary Operator
//! condition ? true:false

let ter = 100
ter >= 80 ? console.log("expensive") : console.log("not expensive");

