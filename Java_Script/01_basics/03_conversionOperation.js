//conversion operation, this helps to convert one data type to another data type



// CONVERSION TO NUMBER

let score = "33ab";

console.log(typeof score)
console.log(typeof(score))

let valueInNumber = Number(score)
console.log(typeof valueInNumber)
console.log(valueInNumber) // NaN is not a number, because the string "33ab" cannot be converted to a valid number

let score2 = null;
console.log(typeof score2)
console.log(typeof(score2))

let valueInNumber2 = Number(score2)
console.log(typeof valueInNumber2)
console.log(valueInNumber2) // 0, because null is converted to 0 when using Number()

let score3 = true;

console.log(typeof score3)
console.log(typeof(score3))

let valueInNumber3 = Number(score3)
console.log(typeof valueInNumber3)
console.log(valueInNumber3) // 1, because true is converted to 1 when using Number()

let score4 = false;

console.log(typeof score4)
console.log(typeof(score4))

let valueInNumber4 = Number(score4)
console.log(typeof valueInNumber4)
console.log(valueInNumber4) // 0, because false is converted to 0 when using Number()

let score5 = undefined;

console.log(typeof score5)
console.log(typeof(score5))

let valueInNumber5 = Number(score5)
console.log(typeof valueInNumber5)
console.log(valueInNumber5) // NaN, because undefined is converted to NaN when using Number()

let score6 = "123";

console.log(typeof score6)
console.log(typeof(score6))

let valueInNumber6 = Number(score6)
console.log(typeof valueInNumber6)
console.log(valueInNumber6) // 123, because the string "123" can be converted to a valid number

let score7 = "shiv";

console.log(typeof score7)
console.log(typeof(score7))

let valueInNumber7 = Number(score7)
console.log(typeof valueInNumber7)
console.log(valueInNumber7) // NaN, because the string "shiv" cannot be converted to a valid number

/* 
so, "33ab" => NaN
null => 0
true => 1
false => 0
undefined => NaN
"123" => 123
"shiv" => NaN   
*/






// CONVERSION TO BOOLEAN

let isLoggedIn = 1

let booleanIsLoggedIn = Boolean(isLoggedIn)
console.log(typeof booleanIsLoggedIn)
console.log(booleanIsLoggedIn) // true, because 1 is converted to true when using Boolean()

let isLoggedIn2 = 0

let booleanIsLoggedIn2 = Boolean(isLoggedIn2)
console.log(typeof booleanIsLoggedIn2)
console.log(booleanIsLoggedIn2) // false, because 0 is converted to false when using Boolean()

let isLoggedIn3 = "shiv"

let booleanIsLoggedIn3 = Boolean(isLoggedIn3)
console.log(typeof booleanIsLoggedIn3)
console.log(booleanIsLoggedIn3) // true, because non-empty strings are converted to true when using Boolean()

let isLoggedIn4 = ""

let booleanIsLoggedIn4 = Boolean(isLoggedIn4)
console.log(typeof booleanIsLoggedIn4)
console.log(booleanIsLoggedIn4) // false, because empty strings are converted to false when using Boolean()

/* 
so, 0 => false
1 => true
"shiv" => true
"" => false
*/

// CONVERSION TO STRING
let someNumber = 33;
let stringNumber = String(someNumber)
console.log(stringNumber) // "33", because the number 33 is converted to a string when using String()