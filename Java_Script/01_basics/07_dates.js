// Dates

let myDate = new Date() //Date is an object

console.log(myDate.toString()) // Output Fri Jun 26 2026 08:59:02 GMT+0530 (India Standard Time)
console.log(myDate.toDateString()) // Output Fri Jun 26 2026
console.log(myDate.toISOString()) // Output 2026-06-26T03:29:02.065Z
console.log(myDate.toJSON()) // Output 2026-06-26T03:29:02.065Z
console.log(myDate.toLocaleDateString()) // Output 6/26/2026
console.log(myDate.toLocaleString()) // Output 6/26/2026, 8:59:02 AM
console.log(myDate.toLocaleTimeString()) // Output 8:59:02 AM
console.log(myDate.toTimeString()) // Output 08:59:02 GMT+0530 (India Standard Time)
console.log(myDate.toUTCString()) // Output Fri, 26 Jun 2026 03:29:02 GMT
console.log(myDate.getTimezoneOffset()) // Output -330 Difference b/w UTC time and Local Time IST ahead of UTC so negative(that means UTC is behind IST)
//if IST was behind then positive (but its not)


console.log()

let createdDate= new Date(2023,0,23,5,3)//yr,month(starts from 0),date, hr, min
//Date("2023-01-14") YY MM DD
//Date("01-14-2023") MM DD YY
console.log(createdDate.toDateString())

console.log();



let myTimestamp=Date.now()
console.log(myTimestamp);//mili sec

console.log(createdDate.getTime());//mili sec from date for comparing times

//sec convert
console.log();

console.log(Math.floor(Date.now()/1000))// secs


//======================

let newDate = new Date()
console.log(newDate.getDate());//date extract
console.log(newDate.getDay());//day
console.log(newDate.getMonth()+1);//month +1 coz it starts from 0
//so many more

//=====================
//customization

newDate.toLocaleString('default',{
    weekday : "long"
})