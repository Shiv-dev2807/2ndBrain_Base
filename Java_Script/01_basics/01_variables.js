const accountId = 123456 // const variable, cannot be reassigned

let accountEmail = "user@example.com" // let variable, can be reassigned
var accountPassword = "password123" // var variable, can be reassigned

accountCity = "New York" // global variable, can be reassigned

//accountId = 654321 // This will throw an error because accountId is a const variable

console.log(accountId) //console.log() is used to print the value of accountId to the console

console.table({ accountId, accountEmail, accountPassword, accountCity }) //console.table() is used to print the values of the variables in a table format to the console

// never use var, use let or const instead coz var is function scoped and can lead to unexpected behavior, while let and const are block scoped and provide better control over variable declarations

let accountState; // undefined variable, can be reassigned

console.table({ accountId, accountEmail, accountPassword, accountCity, accountState })
