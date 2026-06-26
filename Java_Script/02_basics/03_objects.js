//two ways to declare objects = literal, constructor
// singleton object will be created when object declared using constructor

//Object.create (constructor)

//object literals

const mySy = Symbol("key1")

const jsUser = {//key and value
    name : "shiv",
    "fullname":"shivprasad",//cannot be accessed by .
    [mySy] : "mykey1",//symbol
    age:18,
    loc:"jaipur",
    email:"shiv@gmail.com",
    isLoggedIn:false,
    lastLoginDays : ["monday","sat"]

}
//access 1
console.log(jsUser.age);
console.log(jsUser["email"]);
console.log(typeof jsUser[mySy]);

//change
jsUser.email="@gmail.com"
//Object.freeze(jsUser)//freeze the changes
//jsUser.name = "hi"


jsUser.greeting = function(){
    console.log("Hello Js User");
}
jsUser.greeting2 = function(){
    console.log(`Hello Js User, ${this.name}`);
}

console.log(jsUser.greeting());
console.log(jsUser.greeting2())

//==============================================================