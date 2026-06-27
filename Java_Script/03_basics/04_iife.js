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