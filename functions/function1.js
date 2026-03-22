function saymyname() {
    console.log("h");
    console.log("i");
    console.log("t");
    console.log("e");
    console.log("s");
    console.log("h");
}

//saymyname=> this is reference
//saymyname()=>this is function call

console.log(saymyname);
saymyname()


function addtwo(number1,number2){
console.log(number1+number2)
}
console.log(addtwo(33,55));

console.log(addtwo(22,'a'));
console.log(addtwo(22,null));
console.log(addtwo(2,'334'));

function addtwo(number1,number2) {
    let result=number1+number2;
    return result;
    
}

const res=addtwo(8,9)
console.log("result:",res)


// function loginusermessage(username){
//     if(username==undefined){
//         console.log("enter a username")
//     }
//     return `${username} just logged in`
// }
function loginusermessage(username="sam"){
    if(username==undefined){
        console.log("enter a username")
    }
    return `${username} just logged in`
}
console.log(loginusermessage());

function calculatecartprice(num1){
    return num1;
}
calculatecartprice(55);
console.log(calculatecartprice(55))

function calculateprice2(...num1){
    return num1;
}
console.log(calculateprice2(200,400,500))

function calculateprice3(val1,val2,val3,...num1)
{
    return num1;
}
console.log(calculateprice3(200,400,500,2000))

function calculateprice4(val1,val2,...num1)
{
    return val2;
}
console.log(calculateprice4(200,400,500,2000))


const user={
    username:"hitesh",
    prices:199
}

function handleobject(anyobject){
    console.log(`username is ${anyobject.username} and price is ${anyobject.prices}`)
}

handleobject({
    username:"hitesh",
    prices:199
})

const myNewArray=[200,400,600,800]

function returnSecondValue(getArray){
    return getArray[1]
}

console.log(returnSecondValue(myNewArray))
console.log(returnSecondValue([200,400,600,800]))


