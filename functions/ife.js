// Immediately Invoked Function Expressions (IIFE)

// It’s a function that:

// Is defined as an expression
// Runs immediately after it’s created
// 1. Avoid polluting global scope
(function chai(){
    // named IIFE
    console.log(`DB CONNECTED`);
})();

( (name) => {
    console.log(`DB CONNECTED TWO ${name}`);
} )('hitesh')