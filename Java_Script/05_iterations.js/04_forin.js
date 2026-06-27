const myObj = {
    js : "javas",
    cpp : "c++"
}

for (const key in myObj) {
    console.log(key);   
}

for (const key in myObj) {
    console.log(myObj[key]);   
}

for (const key in myObj) {
    console.log(`${key} key's value is = ${myObj[key]}`);   
}


const arr = [1,2,3,4,5]

for (const key in arr) {
     console.log(key); //indexes?
     
}

for (const key in arr) {
     console.log(arr[key]);
     
}

for (const key in arr) {
     console.log(`for index ${key} value is ${arr[key]}`);
     
}



// maps

const map = new Map(); // not iterable using forin
map.set(1,2)
map.set(3,4)
map.set(5,6)
map.set(7,8)

for (const key in map) {
    console.log(key);
}