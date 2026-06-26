// copies, call, use, etc

//const { use } = require("react");

/*

function sayHi(){
    console.log("Hi");
}
sayHi()

function addNum(num1,num2){//parameteres
    console.log(num1+num2);//just prints not returns
}

const res = addNum(1,2)//arguments

console.log(res);

function addNum(num1,num2){
    let res = num1+num2;
    return res
    //after result no code will work
}

const res = addNum(1,2)
console.log(res);


function addNum(num1,num2){
    return num1+num2
}

const res = addNum(1,2)
//console.log(res);


function loginUserMessage(name){
    return `${name} just logged in`
}

//console.log(loginUserMessage("shiv"));

function loginUserMessage(name){
    if(name === undefined){
        console.log("please enter a username");
        return   
    }
    return `${name} just logged in`
}
//console.log(loginUserMessage());

function loginUserMessage(name = "Guest"){
    if(!name){
        console.log("please enter a username");
        return   
    }
    return `${name} just logged in`
}
console.log(loginUserMessage());

*/


//====================================================================//

// functions with objects and array
// rest ... multiple values in functions
/* 
another case 
(val1, val2, ...num1) = (10,20,30,40) val1 = 10, val2 = 20. num1 = 30 40
*/
function calculateCartPrice(...num1){
    return num1
}
console.log(calculateCartPrice(10,12,30,40))

const user = {
    username:"shiv",
    price:199
}
function handleObject (anyobject){
    console.log(`Username is ${anyobject.username} and price is ${anyobject.price}`);
}
//handleObject(user)
/*
handleObject({
    username:"s",
    price:20
})
*/
const arr = [200,400,100,600]
function returnSecValue(getarr){
    return getarr[1]
}
//console.log(returnSecValue(arr));
console.log(returnSecValue([200,100,400]));
