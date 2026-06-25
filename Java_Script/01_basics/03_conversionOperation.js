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

// OPERATIONS

let value1 = 3;
let newValue1 = -value1; // -3, because the unary minus operator negates the value of value1
console.log(newValue1)

console.log(2+2) // 4, because the + operator adds the two numbers together
console.log(2-2) // 0, because the - operator subtracts the second number from the first number
console.log(2*2) // 4, because the * operator multiplies the two numbers together
console.log(2/2) // 1, because the / operator divides the first number by the second number
console.log(2%2) // 0, because the % operator returns the remainder of the division of the first number by the second number
console.log(2**2) // 4, because the ** operator raises the first number to the power of the second number

let str1 = "shiv"
let str2 = " prasad"
let str3 = str1 + str2
console.log(str3) // "shiv prasad", because the + operator concatenates the two strings together


console.log("1" + 2) // "12", because the + operator concatenates the string "1" and the number 2 together
console.log(1+"2") // "12", because the + operator concatenates the number 1 and the string "2" together    
console.log("1" + 2 + 2) // "122", because the + operator concatenates the string "1" and the number 2 together, and then concatenates the result with the number 2
console.log(1 + 2 + "2") // "32", because the + operator adds the two numbers together, and then concatenates the result with the string "2"
console.log("1" - 2) // -1, because the - operator converts the string "1" to a number and then subtracts 2 from it

console.log((3+4)*5%3) // 2, because the expression is evaluated as follows: (3+4) = 7, 7*5 = 35, 35%3 = 2
// Use parantheses to change the order of operations

//dont do this
console.log(+true) // 1, because the unary plus operator converts true to 1
console.log(+false) // 0, because the unary plus operator converts false to 0
console.log(+"") // 0, because the unary plus operator converts an empty string to 0
console.log(+"shiv") // NaN, because the unary plus operator cannot convert the string "shiv" to a number

//==========================================================================================//

let num1, num2, num3
num1 = num2 = num3 = 2 + 2 // not recommended, because it is not clear what the value of num1, num2, and num3 will be
console.log(num1, num2, num3) // 4 4 4, because the expression is evaluated as follows: 2 + 2 = 4, num3 = 4, num2 = 4, num1 = 4

let gameCounter = 100
console.log(gameCounter++) // 100, because the post-increment operator returns the value of gameCounter before incrementing it
console.log(gameCounter) // 101, because the value of gameCounter has been incremented by 1

let gameCounter2 = 100
console.log(++gameCounter2) // 101, because the pre-increment operator increments the value of gameCounter2 before returning it

// prefix increment/decrement operator is used when you want to increment/decrement the value of a variable before using it in an expression
// postfix increment/decrement operator is used when you want to use the value of a variable in an expression before incrementing/decrementing it

//example

let x = 3
const y = x++
console.log(`x: ${x}, y: ${y}`) // x: 4, y: 3, because the post-increment operator returns the value of x before incrementing it

let a = 3
const b = ++a
console.log(`a: ${a}, b: ${b}`) // a: 4, b: 4, because the pre-increment operator increments the value of a before returning it