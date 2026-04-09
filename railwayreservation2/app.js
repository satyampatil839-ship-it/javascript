import React, { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [section, setSection] = useState("home");
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    train: "Rajdhani Express"
  });
  const [pnrInput, setPnrInput] = useState("");
  const [pnrResult, setPnrResult] = useState("");

  // Load from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(data);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  // Handle input change
  function handleChange(e) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  // Book Ticket
  function bookTicket() {
    if (!form.from || !form.to || !form.date) {
      alert("Fill all details");
      return;
    }

    const newBooking = {
      ...form,
      pnr: Math.floor(Math.random() * 1000000)
    };

    setBookings([...bookings, newBooking]);
    setSection("bookings");
  }

  // Check PNR
  function checkPNR() {
    const result = bookings.find(b => b.pnr == pnrInput);

    if (result) {
      setPnrResult(`PNR: ${pnrInput} - Confirmed (${result.from} → ${result.to})`);
    } else {
      setPnrResult("PNR not found!");
    }
  }

  return (
    <div>

      {/* Navbar */}
      <div className="navbar">
        <h2>RailReservation</h2>
        <div className="menu">
          <button onClick={() => setSection("home")}>Home</button>
          <button onClick={() => setSection("search")}>Search</button>
          <button onClick={() => setSection("pnr")}>PNR</button>
          <button onClick={() => setSection("bookings")}>Bookings</button>
        </div>
      </div>

      {/* Home */}
      {section === "home" && (
        <div className="section">
          <h1>Book Train Tickets Easily</h1>
          <button onClick={() => setSection("search")}>Book Now</button>
        </div>
      )}

      {/* Search */}
      {section === "search" && (
        <div className="section">
          <h2>Search Trains</h2>

          <input id="from" placeholder="From" onChange={handleChange} />
          <input id="to" placeholder="To" onChange={handleChange} />
          <input id="date" type="date" onChange={handleChange} />

          <select id="train" onChange={handleChange}>
            <option>Rajdhani Express</option>
            <option>Shatabdi Express</option>
            <option>Duronto Express</option>
          </select>

          <button onClick={bookTicket}>Book Ticket</button>
        </div>
      )}

      {/* PNR */}
      {section === "pnr" && (
        <div className="section">
          <h2>Check PNR</h2>
          <input
            placeholder="Enter PNR"
            onChange={(e) => setPnrInput(e.target.value)}
          />
          <button onClick={checkPNR}>Check</button>
          <p>{pnrResult}</p>
        </div>
      )}

      {/* Bookings */}
      {section === "bookings" && (
        <div className="section">
          <h2>My Bookings</h2>

          {bookings.length === 0 ? (
            <p>No bookings</p>
          ) : (
            bookings.map((b, i) => (
              <div className="card" key={i}>
                <h3>Ticket {i + 1}</h3>
                From: {b.from} <br />
                To: {b.to} <br />
                Train: {b.train} <br />
                Date: {b.date} <br />
                PNR: {b.pnr}
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 RailReservation</p>
      </footer>

    </div>
  );
}

export default App;