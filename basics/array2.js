const marvelheros=["thor","ironman","batman"]
const dcheros=["satyam","spiderman","superman"]

marvelheros.push(dcheros)
console.log(marvelheros)
// by using concat method
const heros=marvelheros.concat(dcheros)
console.log(heros)
// by using spread method
const allnew=[...marvelheros,...dcheros]
console.log(allnew)


console.log(Array.from("hitesh"))
console.log(Array.isArray("hitesh"))

let score1=100;
let score2=200;
let score3=300;
let score5=400;
console.log(Array.of(score1,score2,score3,score5))
