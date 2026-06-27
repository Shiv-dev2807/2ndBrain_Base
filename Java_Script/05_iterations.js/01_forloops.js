//! for

for (let index = 1; index <= 10; index++) {
    const element = index;
    if (element==5) {

    }
    console.log(element);
}

//! nested loops
/*
for(){
    for(){

    }
}
*/

// array
let array = [1,2,3,4,5]
for (let index = 0; index < array.length; index++) {
    const element = array[index];
    console.log(element);
    
}

console.log();
console.log();

//! continue

for(let i = 1;i<=5;i++){
    if(i==3){
        continue
    }
    else{
        console.log(i);
    }
}

console.log();


//! break

for(let i = 1;i<=5;i++){
    if(i==3){
        break
    }
    else{
        console.log(i);
    }
}