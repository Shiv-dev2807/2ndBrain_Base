// arrays

const myArray = [1,2,3,4,5]//different types, [], mixed, collection of multiple items, resizable, access using index, zero based indexing

const heros =["superman","batman","spiderman"]

const arr2 = new Array(1,2,3,4)
console.log(myArray[0]);

// Array methods lots of them in console,inspect ex= const num = [1,2,3,4], num all methods listed

myArray.push(6)//push at last
console.log(myArray);
myArray.pop()//pop last
console.log(myArray);

myArray.unshift(6)//insert at 1st and moves all
console.log(myArray);
myArray.shift()//removes the 1st element
console.log(myArray);

console.log(myArray.includes(69));
console.log(myArray.indexOf(5));


const arr = myArray.join()
console.log(myArray);
console.log(arr);
console.log(typeof arr);


// slice, splice
const myn1 = myArray.slice(1,3) // excludes 3

console.log(myn1);

const myn2 = myArray.splice(1,3) // includes 3 also removes them from the original array

console.log(myn2);

console.log(myArray);
