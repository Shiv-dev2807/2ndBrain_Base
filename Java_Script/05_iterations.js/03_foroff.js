// for off, 
//array specific

const arr = [1,2,3,4,5]


//! for off
for (const i of arr) {
    console.log(i);
    
}


// Maps

const map = new Map()//holds key value pairs,unique
map.set("s","in")

console.log(map);


for (const [key,value] of map) {
    console.log(key+":="+value);
    
}


// object

const myob = {
    "nfs":140,
    "sts":130
}

/*
for (const [key,value] of myob) { // for off doesnt work for objects
    console.log();
    
}
*/
