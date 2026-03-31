const user = {
    username: "hitesh",
    price: 999,

    welcomeMessage: function() {
        console.log(`${this.username} , welcome to website`);
        console.log(this);//this tells about current values it will print whole object;
    }

}

 user.welcomeMessage() //hitesh ,welcome to website
// user.username = "sam"//here we changed the value in object
 user.welcomeMessage()//sam,welcome to website

// console.log(this);// we are in  node enviroment  hence it will give  empty {} object

// function chai(){
//     let username = "hitesh"
//     console.log(this.username);//we cannot use this in functions
// }

// chai()//undefined

// const chai = function () {
//     let username = "hitesh"
//     console.log(this.username);
// }
// chai()//undefined

const chai =  () => {
    let username = "hitesh"
    console.log(this.username);
}


chai()

const addTwo = (num1, num2) => {
    return num1 + num2
}
console.log(addTwo(3,4))//7
//implicit keyword
// const addTwo = (num1, num2) =>  num1 + num2

// const addTwo = (num1, num2) => ( num1 + num2 )  if() is used no need of using return keyword

// const addTwo = (num1, num2) => ({username: "hitesh"})


// console.log(addTwo(3, 4))//{username:"hitesh"}


// const myArray = [2, 5, 3, 7, 8]

// myArray.forEach()