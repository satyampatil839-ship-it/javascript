
// Array to store bookings
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];


function showSection(section){

document.getElementById("home").style.display="none";
document.getElementById("search").style.display="none";
document.getElementById("pnr").style.display="none";
document.getElementById("bookings").style.display="none";
document.getElementById("login").style.display="none";
document.getElementById("register").style.display="none";
document.getElementById("contact").style.display="none";
document.getElementById("passenger").style.display="none"; 

  document.getElementById(section).style.display = "block";


    if(section === "bookings"){
        displayBookings(); // refresh bookings list
    }
}

let tempBooking = {};

function bookTicket(){

    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
    var date = document.getElementById("date").value;
    var train = document.getElementById("train").value;

    if(from === "" || to === "" || date === ""){
        alert("Please fill all details!");
        return;
    }

    if(from === to){
        alert("From and To cannot be same");
        return;
    }

    tempBooking = { from, to, date, train };

    showSection("passenger");
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

        <b>PNR:</b> ${b.pnr} <br>
        <b>Name:</b> ${b.name} <br>
        <b>Age:</b> ${b.age} <br>
        <b>Gender:</b> ${b.gender} <br>

        <b>From:</b> ${b.from} <br>
        <b>To:</b> ${b.to} <br>
        <b>Train:</b> ${b.train} <br>
        <b>Date:</b> ${b.date} <br>

        <b>Class:</b> ${b.class} <br>
        <b>Berth:</b> ${b.berth} <br>

        <button onclick="cancelTicket(${index})">
            Cancel Ticket
        </button>
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
function cancelTicket(index){

    // Confirm before deleting
    let confirmDelete = confirm("Are you sure you want to cancel this ticket?");

    if(!confirmDelete) return;

    // Remove ticket from array
    bookings.splice(index, 1);

    // Update localStorage
    localStorage.setItem("bookings", JSON.stringify(bookings));

   
    
    displayBookings();
}



function confirmBooking(){

    let name = document.getElementById("pname").value;
    let age = document.getElementById("page").value;
    let gender = document.getElementById("pgender").value;
    let berth = document.getElementById("pberth").value;
    let travelClass = document.getElementById("pclass").value;

    if(name === "" || age === "" || gender === "" || berth === "" || travelClass === ""){
        alert("Please fill all passenger details!");
        return;
    }

    let booking = {
        ...tempBooking,
        name,
        age,
        gender,
        berth,
        class: travelClass,
        pnr: Math.floor(100000 + Math.random() * 900000)
    };

    bookings.push(booking);

    localStorage.setItem("bookings", JSON.stringify(bookings));

    alert("✅ Ticket Booked Successfully!");

    showSection("bookings");
}