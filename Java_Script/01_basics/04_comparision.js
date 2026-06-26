/*
>, >=, <, <=, ==, ===, !=, !==
*/

// problems
console.log("2" > 1); // true reason: string is converted to number
console.log("02" == 1); // false reason: string is converted to number
// this is problem because it might lead to unexpected results, so we should use === and !== instead of == and !=

console.log(null>0); // false reason: null is converted to 0
console.log(null>=0); // true reason: null is converted to 0
console.log(null==0); // false reason: null is not converted to 0, it is only equal to undefined
// comparision symbols like >,etc converts null to 0, but == does not convert null to 0, it only converts undefined to null.
// So we should be careful while using these comparision symbols with null and undefined.

console.log(undefined==0); // false reason: undefined is not converted to 0, it is only equal to null
//undefined will always have false value when compared with any other value except null. So we should be careful while using undefined in comparision.


// strict check
// === and !== are strict check, they do not convert the values to same type before comparision