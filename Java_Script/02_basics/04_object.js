//const tinderUser = new Object()//singleton

const tinderUser = {} //non single ton

tinderUser.id="123"
tinderUser.name="sam"
tinderUser.islogged=false

//console.log(tinderUser); 

const apUsr ={
    email:"shiv@gmail.com",
    fullname:{
        userFullname:{
            firstname:"shiv",
            lastname:"dev"
        }
    }
}

//console.log(apUsr.fullname.userFullname.firstname);
//console.log(apUsr.fullname?.userFullname.firstname); ? if this values is there then do it

//concat
const obj1 ={
    1:"a",
    2:"b"
}
const obj2={
    3:"a",
    4:"b"
}

//const obj3 = Object.assign(obj1,obj2)
//console.log(obj3);

//const obj3 = Object.assign({},obj1,obj2) //{} target , obj1 obj2 source, add source to target good way to write

const obj3 = {...obj1,...obj2} //spread, latest

//console.log(obj3);

//objects in arrays
const users = [ //might come in this way from data base
    {
        id:1,
        email:"h@gmail.com"
    }
]

//acess
//users[1].email

console.log(tinderUser);

console.log(Object.keys(tinderUser));//very imp
console.log(Object.values(tinderUser));

console.log(Object.entries(tinderUser)) // key value


console.log(tinderUser.hasOwnProperty('i')); // before using property use check if the property is there or not

//more functions,etc, inspect, console


//object destructure

const course = {
    name1:"js",
    price:"1000",
    teacher:"hitesh"
}

//for using . , []

const {name1} = course
console.log(name1)

//or

const {name1:n} = course
console.log(n);


// ======================API======================================== //
//JSON file
/*
{
    "name":"shiv",
    "coursename":"js",
    "price":"free"
}
*/

// array format

/*
[
    {},
    {},
    {}
]
*/