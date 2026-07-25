// consume mostly



// fetch('http://sss.com').then().catch().finally()

//object representing eventual completion
//!creation
const promiseOne = new Promise(function(resolve,reject){//resolve completed, reject promise not completed
    //! Do an async task
    //! db calls, cryptography, network
    setTimeout(function(){
        console.log('Async task is complete');
        resolve() //connected resolve and then
    },1000)

})

//!consume
promiseOne.then(function(){
    console.log('Promise consumed');
}) //!resolve connection with then

// new Promise(function(resolve,reject){//resolve completed, reject promise not completed
//     Do an async task
//     db calls, cryptography, network
//     setTimeout(function(){
//         console.log('Async task is complete');
//     },1000)

// })



new Promise(function(resolve,reject){
    setTimeout(function(){
        console.log("Async task 2");
        resolve()
    },1000)
}).then(function(){
    console.log("Async 2 resolved");
})




const promiseThree = new Promise(function(resolve,reject){
    setTimeout(function(){
        resolve({username:"Shiv",email:"shiv@examplegmail.com"})
    },1000)
})

promiseThree.then(function(user){
    console.log(user);
})


const promiseFour = new Promise(function(resolve,reject){
    setTimeout(function(){
        let error = false
        if(!error){
            resolve({username:"Shiv",password:"123"})
        }else{
            reject('ERROR Something went wrong')
        }
    },1000)
})

// promiseFour.then().catch()

promiseFour
.then((user)=>{
    console.log(user);
    return user.username
})
.then((username)=>{
    console.log(username);
})
.catch(function(error){
    console.log(error);  
})


