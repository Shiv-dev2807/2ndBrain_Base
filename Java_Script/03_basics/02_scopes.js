//scope {}

// var doesnt care about scope, dont use var

//global scope 
let a = 300

if (true) {
    let a = 2//local scope
}
console.log(a);


// node and console inspect global scope are diff
/*
for nested func, if, etc

func 1{ // gobal for func 2
    a = 2 // can be used by func 2
    fun 2{ // local for func 1
        b = 1 // func 1 cant access this
    }
}
*/

// declaring function 2 types

/*
-this is allowed-

addone(5)
func addone(n){
    r n +1
}

-this is not allowed coz its not initialized

addtwo(5)
const addtwo = func(n){
    r n+2
}

*/