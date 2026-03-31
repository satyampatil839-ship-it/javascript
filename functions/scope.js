if(true){
let a=10;
const b=20;
var c=30;
}
// console.log(a);-->error
// console.log(b);--->error
console.log(c)
//output 30
// var is NOT block-scoped, it is function-scoped.

// block scope>global scope
//global scope
//let and const => function scope
//var => block scope if ,for,while


//global scope
// let name = "Satyam";

// function greet() {
//     console.log(name); // accessible here
// }

// greet();
// console.log(name); // also accessible here
function one(){
    const username = "hitesh"

    function two(){
        const website = "youtube"
        console.log(username);
    }
    // console.log(website);  //website is not defined
    // two can access variables of one but one cannot access variables of two

     two()

}

 one()//hitesh

if (true) {
    const username = "hitesh"
    if (username === "hitesh") {
        const website = " youtube"
         console.log(username + website);// hitesh youtube
    }
    // console.log(website);//website is not dedined
}

// console.log(username);//username is not defined


// ++++++++++++++++++ interesting ++++++++++++++++++


console.log(addone(5))// we can acess before fuction declaration

function addone(num){
    return num + 1
}



addTwo(5) //here cannot acces addTWO before declaration this is known ans hosting
const addTwo = function(num){
    return num + 2
}

