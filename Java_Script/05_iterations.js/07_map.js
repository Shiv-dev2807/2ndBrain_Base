const n = [1,2,3,4,5,6,7,8,9,10]

//! const n1 = n.map((num)=>num+10) 
//! if {num+10} use return



//chaining
const n1 = n
            .map((num)=>num*10)
            .map((num) => num+1)
            .filter((num)=> num>80)

console.log(n1);

