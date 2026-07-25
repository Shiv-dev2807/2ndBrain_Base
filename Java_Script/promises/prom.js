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




