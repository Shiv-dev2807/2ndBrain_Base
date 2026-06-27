const n = [1,2,3,4]

const iv = 0
const sum = n.reduce(
    (ac,cv) => ac + cv,// accumulator, currentValue, initalValue
    iv
)

console.log(sum);


const s = n.reduce(function(acc, cv) {
    console.log(`ac=${acc},cv=${cv}`);
    return acc + cv 
},0)
console.log(s);

//object
const sc = [

    {
        in : "h",
        p  : 1
    },

    {
        in : "i",
        p  : 2
    },

    {
        in : "j",
        p  : 3
    }

]

const scPS = sc.reduce(
    (acc, a) => acc+ a.p ,0
)
console.log(scPS);
