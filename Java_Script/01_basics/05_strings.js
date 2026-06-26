const name = "John Doe";
const repoCount = 30;

//console.log(name + " has " + repoCount + " repositories"); // Concatenation //this is old way

//best syntax
console.log(`${name} has ${repoCount} repositories`); // Template String //this is new way, and readable way, we can use variables inside ${} and it will be replaced with the value of the variable.

//object type string
const gameName = new String("The-Last-of-Us"); //it will give key value pair, and it will give object type //object //length, all methods of string will be available
console.log(gameName[0]); //T

//methods of string
console.log(gameName.__proto__); //it will give the prototype of the string object, objects can be seen in the console of inspect of browser, it will give all the methods of string, and we can use them on the string object

console.log(gameName.length); //length of the string

console.log(gameName.toUpperCase()); //it will convert the string to uppercase

console.log(gameName.charAt(0)); //it will give the character at the specified index

console.log(gameName.indexOf("T")); //it will give the index of the specified character

//substring
const newString = gameName.substring(0, 3); //it will give the substring from the specified index to the specified index, 3 is exclusive
console.log(newString);

//slice
const newString2 = gameName.slice(-1,4); //it will give the substring from the specified index to the specified index, 4 is exclusive, -3 means from the end of the string
console.log(newString2); // output: blank? coz slice(-1,4) means start from the last character and go to index 4, but since -1 is greater than 4, it returns an empty string. If you want to get the last character, you can use slice(-1) or slice(-1, gameName.length).

//trim
const newString3 = gameName.trim(); //it will remove the whitespace from the start and end of the string
console.log(newString3); //output: The-Last-of-Us

//split
const newString4 = gameName.split("-"); //it will split the string into an array of substrings based on the specified separator
console.log(newString4); //output: [ 'The', 'Last', 'of', 'Us' ]

//replace
const newString5 = gameName.replace("-", " "); //it will replace the specified substring with the new substring
console.log(newString5); //output: The Last of Us

//includes
const newString6 = gameName.includes("Last"); //it will check if the specified substring is present in the string
console.log(newString6); //output: true

//startsWith
const newString7 = gameName.startsWith("The"); //it will check if the string starts with the specified substring
console.log(newString7); //output: true

//endsWith
const newString8 = gameName.endsWith("Us"); //it will check if the string ends with the specified substring
console.log(newString8); //output: true

//repeat
const newString9 = gameName.repeat(2); //it will repeat the string the specified number of times
console.log(newString9); //output: The-Last-of-UsThe-Last-of-Us

