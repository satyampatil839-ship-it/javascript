const sym=Symbol("key")
const person = {
  firstName: "John",
  lastName: "Doe",
  "full name":"satyam patil",
  [sym]:"mykey1",
  age: 50,
  eyeColor: "blue"
};

console.log(person["firstName"])
console.log(person.firstName)
console.log(person["full name"])
console.log(person[sym])
person.age=30;
person.age=90;
console.log(person)

// Object.freeze(person)  after this literal values will not change 
person.greeting=function(){
  console.log("hello js user");
}
person.greeting2=function(){
  console.log(`hello user this is ${this.firstName}` )
}
console.log(person.greeting())
console.log(person.greeting2())
