//javascript arrays are resizable and can be mixed of diffferent data types
const myarr=[2,4,6,7,9]
console.log(myarr[0])

const myheros=["satyam","shaktiman","dubey"]
const myarr2= new Array(77,99,33,55);
console.log(myarr2[0])

//array methods
myarr.push(12)
console.log(myarr)
// myarr.pop()//last element will pop up
// console.log(myarr)

// slice and splice

console.log(myarr.slice(1,3))
console.log(myarr)
const myn2=myarr.splice(1,3)
console.log(myn2)
console.log(myarr)

console.log(myarr.includes(8))
console.log(myarr.indexOf(9))