//! IIFE Immediately Invoked Function Expressions IIFE

/*



*/

// named IIFE
(function one(){
    console.log("DB connected");
})(); //! ; required

//! () ()

//? coz of global scope pollution variables functions declaration, to remove that global scope pollution we use IIFE

//! arrow func

(()=>{
    console.log("DB2 Connected");
    
})();


//! with input argument
((name)=>{
    console.log(`DB2 Connected ${name}`);
    
})("shiv");



let val1 = 10
let val2 = 5
function addNum(num1,num2){
    let total = num1+num2
    return total
}
let res = addNum(val1,val2)
let res2 = addNum(10,2)
console.log(res);
console.log(res2);