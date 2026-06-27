const arr = [1,2,3,4,5]


arr.forEach( function (item) {
    console.log(item);    
} )

console.log();

arr.forEach((item) => {
    console.log(item);
    
});

console.log();

arr.forEach(element => {
   console.log(element); 
});


console.log();
console.log();
const arr1 = [3,4,"shiv"]

function printMe(a){
    console.log(a);    
}

arr1.forEach(printMe)



console.log();
console.log();
console.log();
console.log();

const cod = [1,9,3,4,5]
cod.forEach((i,index,arr) => {
    console.log(i,index,arr);  
})

console.log();
console.log();
console.log();
console.log();
console.log();
console.log();
console.log();
console.log();

const myCod = [

    {
        langName : "javas",
        langFile : "js"
    },
    {
        langName : "java",
        langFile : "java"
    },
    {
        langName : "python",
        langFile : "py"
    }

]



myCod.forEach( (i) => {
    console.log(i);
    
})

myCod.forEach( (i) => {
    console.log(i.langName);
    
})

myCod.forEach( (i) => {
    console.log(i.langFile);
    
})