const marvel = ["ironman","spiderman","captain america"]
const dc = ["batman","superman","flash"]

//marvel.push(dc)
console.log(marvel);
//console.log(marvel[3][0]);

//better way
const all = marvel.concat(dc) // there is limitation here
console.log(all);

// more easy 

//spread 
const all_spread = [...marvel,...dc] // can add more n number
console.log(all_spread);

// usefull
const arr = [1,2,3,[4,5,6],7,[6,7,[4,5]]]
const arr1 = arr.flat(Infinity)
console.log(arr1);

//isArray?
console.log(Array.isArray("shiv"));

// convert
console.log(Array.from("shiv"));

// object convert
console.log(Array.from({name: "shiv"})); // gives empty array, array should be of keys or values

//of
let s1 = 100
let s2 = 200
let s3 = 300
console.log(Array.of(s1,s2,s3));
