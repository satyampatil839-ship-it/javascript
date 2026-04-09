// function showSection(section){

// document.getElementById("home").style.display="none";
// document.getElementById("search").style.display="none";
// document.getElementById("pnr").style.display="none";
// document.getElementById("bookings").style.display="none";

// document.getElementById(section).style.display="block";

// }



// function bookTicket(){

// var from = document.getElementById("from").value;
// var to = document.getElementById("to").value;
// var date = document.getElementById("date").value;
// var train = document.getElementById("train").value;

// var ticket =
// "<h3>Ticket Confirmed</h3>" +
// "From: " + from + "<br>" +
// "To: " + to + "<br>" +
// "Train: " + train + "<br>" +
// "Date: " + date;

// document.getElementById("booking-list").innerHTML = ticket;

// showSection("bookings");

// }



// function checkPNR(){

// var pnr = document.getElementById("pnr-number").value;

// document.getElementById("pnr-result").innerHTML =
// "PNR: " + pnr + "<br>Status: Confirmed";

// }
// Array to store bookings
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// Show Sections
function showSection(section){

    document.getElementById("home").style.display="none";
    document.getElementById("search").style.display="none";
    document.getElementById("pnr").style.display="none";
    document.getElementById("bookings").style.display="none";
document.getElementById("login").style.display="none";
document.getElementById("register").style.display="none";
document.getElementById("contact").style.display="none";

    document.getElementById(section).style.display="block";

    // If bookings page → refresh list
    if(section === "bookings"){
        displayBookings();
    }
}


// Book Ticket
function bookTicket(){

    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
    var date = document.getElementById("date").value;
    var train = document.getElementById("train").value;

    // Simple validation
    if(from === "" || to === "" || date === ""){
        alert("Please fill all details!");
        return;
    }

    // Create booking object
    let booking = {
        from: from,
        to: to,
        date: date,
        train: train,
        pnr: Math.floor(Math.random() * 1000000) // random PNR
    };

    // Add to array
    bookings.push(booking);

    // Save to localStorage
    localStorage.setItem("bookings", JSON.stringify(bookings));

    // Go to bookings page
    showSection("bookings");
}


// Display all bookings
function displayBookings(){

    let list = document.getElementById("booking-list");
    list.innerHTML = "";

    if(bookings.length === 0){
        list.innerHTML = "<p>No bookings yet</p>";
        return;
    }

    bookings.forEach((b, index) => {
        list.innerHTML += `
            <div class="card">
                <h3>Ticket ${index + 1}</h3>
                From: ${b.from} <br>
                To: ${b.to} <br>
                Train: ${b.train} <br>
                Date: ${b.date} <br>
                PNR: ${b.pnr}
            </div>
        `;
    });
}


// Check PNR
function checkPNR(){

    var pnr = document.getElementById("pnr-number").value;

    let result = bookings.find(b => b.pnr == pnr);

    if(result){
        document.getElementById("pnr-result").innerHTML =
        `PNR: ${pnr} <br>Status: Confirmed <br>
         From: ${result.from} → To: ${result.to}`;
    } else {
        document.getElementById("pnr-result").innerHTML =
        "PNR not found!";
    }
}
function loginUser(){

    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    let storedUser = JSON.parse(localStorage.getItem("user"));

    if(!storedUser){
        document.getElementById("login-result").innerHTML =
        "No user found. Please register first.";
        return;
    }

    if(username === storedUser.username && password === storedUser.password){
        document.getElementById("login-result").innerHTML =
        "Login Successful!";
    } else {
        document.getElementById("login-result").innerHTML =
        "Invalid Username or Password!";
    }
}
function registerUser(){

    let username = document.getElementById("reg-username").value;
    let password = document.getElementById("reg-password").value;

    if(username === "" || password === ""){
        alert("Please fill all details!");
        return;
    }

    let user = {
        username: username,
        password: password
    };

    // Save user in localStorage
    localStorage.setItem("user", JSON.stringify(user));

    document.getElementById("register-result").innerHTML =
    "Registration Successful! Now login.";

}