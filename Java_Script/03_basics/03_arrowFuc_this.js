const user = {
    user : "shiv",
    price : 199,
    
    welcomeMsg : function(){
        console.log(`${this.user}, welcome to website`)//current context to access to access variable from the current object this
        console.log(this)//shows current context
    }
}

user.welcomeMsg() //op shiv
user.user ="shiv2"//changed the current context
user.welcomeMsg() //op shiv2

console.log(this);

// browser global object = is window object

// ======================================================================= \\

/*

function one(){
    let username = "shiv"
    console.log(this.username); // gives undefined (this works in objects)
    console.log(this); // Object [global]
    
}


const one = function(){
    let username = "shiv"
    console.log(this.username); // undefine
    console.log(this); // Object [global]
}

const one = () =>{
    let n = "shiv"
    console.log(this.n); // undefine
    console.log(this); // {}
    
}
one()
*/
// ways to write func

/*
function one(){

}

const one = function(){

}

const one = (num) =>{
    console.log(num)
    
}
one(2)
*/


// another way to write arrow func

//const a = (n1,n2) => n1+n2
const a = (n1,n2) => (n1+n2) // no return keyword in (), we need return keyword in {} used more in react
console.log(a(1,2));

// if want to return object

const b = () => ({n:"shiv"})
console.log(b());
