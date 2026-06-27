//! Ex

const n = "shiv" //truthy

if(n){
    console.log("hi");
}
else{
    console.log("no");
}

const a = "" //falsy

if (a){
    console.log("a");
}
else{
    console.log("b");
}



/*
! Falsy Values

? false, 0, -0, BigInt 0n(0n is written in bigint is also falsy), "", null, undefined, NaN 

! other than these all are truthy, some of them are

? "0", 'false', " ", [], {}, funtion(){},

*/

//check if array empty 
//! arr.length === 0

//object
// const empObj= {}
//! if(Object.keys(empObj).length === 0)