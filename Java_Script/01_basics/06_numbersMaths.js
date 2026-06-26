const score = 40;

const score2 = new Number(40);
console.log(score);
console.log(score2);
// all methods of number are: 
// toString(), toExponential(), toFixed(), toPrecision(), valueOf(), toLocaleString(), isInteger(), isNaN(), isFinite()

// toString() method, by converting a number to a string, we can use the toString() method. This method returns a string representation of the number.
console.log(score.toString());
console.log(score2.toString());

//toFixed() method, by using the toFixed() method, we can format a number to a specified number of decimal places. This method returns a string representation of the number with the specified number of decimal places.
console.log(score.toFixed(2));
console.log(score2.toFixed(2));

// toPrecision() method, by using the toPrecision() method, we can format a number to a specified number of significant digits. This method returns a string representation of the number with the specified number of significant digits.
console.log(score.toPrecision(4));
console.log(score2.toPrecision(4));

//toLocaleString() method, by using the toLocaleString() method, we can format a number to a specified locale. This method returns a string representation of the number with the specified locale.
const hundreds = 1000000000000;
console.log(hundreds.toLocaleString("en-IN"));

//Number. has many more methods those are: isInteger(), isNaN(), isFinite(), EPSILON, MAX_VALUE, MIN_VALUE, MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, NaN, NEGATIVE_INFINITY, POSITIVE_INFINITY, parseFloat(), parseInt(), isSafeInteger(), now(), many more. You can check the documentation for more details.

//========================================MATHS===================================================

console.log(Math) // Math has lots of methods .PI, etc, run this in console inspect

//abs
console.log(Math.abs(-4))
//round, ceil, floor

console.log(Math.round(4.5))
console.log(Math.ceil(4.5))
console.log(Math.floor(4.5))
console.log(Math.min(4,1,2))
console.log(Math.max(4,1,2))

// IMP = Math.random()

console.log(Math.random());//gives output 0 to 1 only

// range?
console.log((Math.random()*10)+1)// min one
console.log((Math.floor(Math.random()*10))+1)

const min = 10//inclusive
const max = 20//exclusive

console.log(Math.floor(Math.random() * (max-min+1) + min))// max-min+1 = range, +min to start from the min