// ==========================================
// MAIN APPLICATION LOGIC
// ==========================================
// Global State
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let selectedTrain = null;
let passengerCount = 1;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const dateInput = document.getElementById('travel-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
    
    // Populate stations datalist
    populateStations();
    
    // Update UI based on login status
    updateUserUI();
    
    // Load trains list for admin
    loadTrainsList();
});

// ========== NAVIGATION ==========
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    
    // Show selected section
    document.getElementById(`${section}-section`).style.display = 'block';
    
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Section-specific actions
    if (section === 'bookings') {
        displayBookings();
    } else if (section === 'admin') {
        loadTrainsList();
        loadAllBookings();
        loadStats();
    }
}

// ========== STATIONS ==========
function populateStations() {
    const stations = DB.getStations();
    const datalist = document.getElementById('stations-list');
    
    if (datalist) {
        datalist.innerHTML = stations.map(s => `<option value="${s}">`).join('');
    }
}

function swapStations() {
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    const temp = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = temp;
}

// ========== TRAIN SEARCH ==========
function searchTrains() {
    const from = document.getElementById('from').value.trim();
    const to = document.getElementById('to').value.trim();
    const date = document.getElementById('travel-date').value;
    const travelClass = document.getElementById('travel-class').value;
    
    if (!from || !to || !date) {
        showToast('Please fill all search fields', 'error');
        return;
    }
    
    const trains = DB.searchTrains(from, to, date, travelClass);
    displayTrainResults(trains, date, travelClass);
}

function displayTrainResults(trains, date, travelClass) {
    const resultsDiv = document.getElementById('train-results');
    
    if (trains.length === 0) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                <h3>😔 No trains found</h3>
                <p>Try different stations or dates</p>
            </div>`;
        return;
    }
    
    resultsDiv.innerHTML = `<h2>Available Trains (${trains.length})</h2>`;
    
    trains.forEach(train => {
        const seats = DB.getSeatAvailability(train.id, travelClass, date);
        const price = train.classes[travelClass]?.price || 0;
        
        let seatsClass = 'seats-available';
        let seatsText = `${seats} Available`;
        
        if (seats === 0) {
            seatsClass = 'seats-none';
            seatsText = 'Not Available';
        } else if (seats < 20) {
            seatsClass = 'seats-limited';
            seatsText = `${seats} Left`;
        }
        
        resultsDiv.innerHTML += `
            <div class="train-card">
                <div class="train-info">
                    <h3>${train.name}</h3>
                    <span class="train-number">#${train.number}</span>
                </div>
                <div class="train-timing">
                    <div class="time">${train.departure}</div>
                    <div class="station">${train.from}</div>
                </div>
                <div class="train-duration">
                    <div class="duration">${train.duration}</div>
                    <div class="line"></div>
                </div>
                <div class="train-timing">
                    <div class="time">${train.arrival}</div>
                    <div class="station">${train.to}</div>
                </div>
                <div class="train-seats">
                    <span class="${seatsClass}">${seatsText}</span>
                </div>
                <div class="train-price">
                    <div class="price">₹${price}</div>
                    <small>${travelClass}</small>
                </div>
                <button class="book-btn" onclick="openBookingModal('${train.id}', '${date}', '${travelClass}')" ${seats === 0 ? 'disabled' : ''}>
                    ${seats === 0 ? 'Sold Out' : 'Book Now'}
                </button>
            </div>`;
    });
}

// ========== BOOKING ==========
function openBookingModal(trainId, date, travelClass) {
    selectedTrain = DB.getTrainById(trainId);
    
    if (!selectedTrain) {
        showToast('Train not found', 'error');
        return;
    }
    
    // Set train info
    document.getElementById('train-info').innerHTML = `
        <div class="selected-train">
            <h3>${selectedTrain.name} (#${selectedTrain.number})</h3>
            <p>${selectedTrain.from} → ${selectedTrain.to}</p>
            <p>Date: ${formatDate(date)} | Class: ${travelClass}</p>
        </div>`;
    
    // Store selection data
    document.getElementById('booking-form').dataset.trainId = trainId;
    document.getElementById('booking-form').dataset.date = date;
    document.getElementById('booking-form').dataset.class = travelClass;
    document.getElementById('booking-form').dataset.price = selectedTrain.classes[travelClass].price;
    
    // Reset passenger forms
    passengerCount = 1;
    document.getElementById('passenger-forms').innerHTML = getPassengerFormHTML(1);
    
    // Update price
    updatePriceSummary();
    
    // Pre-fill email if logged in
    if (currentUser) {
        document.getElementById('contact-email').value = currentUser.email;
        document.getElementById('contact-phone').value = currentUser.phone || '';
    }
    
    openModal('booking-modal');
}

function getPassengerFormHTML(index) {
    return `
        <div class="passenger-form" id="passenger-${index}">
            <h4>Passenger ${index}</h4>
            ${index > 1 ? `<button type="button" class="remove-passenger" onclick="removePassenger(${index})">×</button>` : ''}
            <div class="form-row">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" name="passenger-name-${index}" required>
                </div>
                <div class="form-group">
                    <label>Age</label>
                    <input type="number" name="passenger-age-${index}" min="1" max="120" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Gender</label>
                    <select name="passenger-gender-${index}" required>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Berth Preference</label>
                    <select name="passenger-berth-${index}">
                        <option value="No Preference">No Preference</option>
                        <option value="Lower">Lower</option>
                        <option value="Middle">Middle</option>
                        <option value="Upper">Upper</option>
                        <option value="Side Lower">Side Lower</option>
                        <option value="Side Upper">Side Upper</option>
                    </select>
                </div>
            </div>
        </div>`;
}

function addPassenger() {
    if (passengerCount >= 6) {
        showToast('Maximum 6 passengers allowed', 'error');
        return;
    }
    
    passengerCount++;
    const container = document.getElementById('passenger-forms');
    container.insertAdjacentHTML('beforeend', getPassengerFormHTML(passengerCount));
    updatePriceSummary();
}

function removePassenger(index) {
    document.getElementById(`passenger-${index}`).remove();
    updatePriceSummary();
}

function updatePriceSummary() {
    const form = document.getElementById('booking-form');
    const price = parseInt(form.dataset.price) || 0;
    const passengers = document.querySelectorAll('.passenger-form').length;
    const total = price * passengers;
    
    document.getElementById('price-summary').innerHTML = `
        <div>Base Fare: ₹${price} × ${passengers} passenger(s)</div>
        <div class="total">Total: ₹${total}</div>`;
}

function confirmBooking(event) {
    event.preventDefault();
    
    const form = document.getElementById('booking-form');
    const trainId = form.dataset.trainId;
    const date = form.dataset.date;
    const travelClass = form.dataset.class;
    const price = parseInt(form.dataset.price);
    
    // Collect passenger data
    const passengers = [];
    document.querySelectorAll('.passenger-form').forEach((pf, index) => {
        const i = index + 1;
        passengers.push({
            name: form.querySelector(`[name="passenger-name-${i}"]`)?.value || 
                  pf.querySelector('input[type="text"]').value,
            age: form.querySelector(`[name="passenger-age-${i}"]`)?.value || 
                 pf.querySelector('input[type="number"]').value,
            gender: form.querySelector(`[name="passenger-gender-${i}"]`)?.value || 
                    pf.querySelectorAll('select')[0].value,
            berth: form.querySelector(`[name="passenger-berth-${i}"]`)?.value || 
                   pf.querySelectorAll('select')[1]?.value || 'No Preference'
        });
    });
    
    // Validate
    if (passengers.length === 0 || passengers.some(p => !p.name || !p.age || !p.gender)) {
        showToast('Please fill all passenger details', 'error');
        return;
    }
    
    const contactEmail = document.getElementById('contact-email').value;
    const contactPhone = document.getElementById('contact-phone').value;
    
    if (!contactEmail || !contactPhone) {
        showToast('Please provide contact details', 'error');
        return;
    }
    
    // Check seat availability
    const availableSeats = DB.getSeatAvailability(trainId, travelClass, date);
    if (availableSeats < passengers.length) {
        showToast('Not enough seats available', 'error');
        return;
    }
    
    // Create booking
    const bookingData = {
        trainId: trainId,
        trainNumber: selectedTrain.number,
        trainName: selectedTrain.name,
        from: selectedTrain.from,
        to: selectedTrain.to,
        departure: selectedTrain.departure,
        arrival: selectedTrain.arrival,
        date: date,
        travelClass: travelClass,
        passengers: passengers,
        contactEmail: contactEmail,
        contactPhone: contactPhone,
        pricePerTicket: price,
        totalPrice: price * passengers.length
    };
    
    const booking = DB.createBooking(bookingData);
    
    closeModal('booking-modal');
    showTicket(booking);
    showToast('Booking confirmed! PNR: ' + booking.pnr, 'success');
}

// ========== PNR STATUS ==========
function checkPNR() {
    const pnr = document.getElementById('pnr-input').value.trim();
    
    if (!pnr || pnr.length !== 10) {
        showToast('Please enter a valid 10-digit PNR', 'error');
        return;
    }
    
    const booking = DB.getBookingByPNR(pnr);
    
    const resultDiv = document.getElementById('pnr-result');
    
    if (!booking) {
        resultDiv.innerHTML = `
            <div class="pnr-card">
                <h3>❌ PNR Not Found</h3>
                <p>No booking found with PNR: ${pnr}</p>
            </div>`;
        return;
    }
    
    resultDiv.innerHTML = `
        <div class="pnr-card">
            <div class="pnr-header">
                <div>
                    <h3>PNR: ${booking.pnr}</h3>
                    <small>Booked on: ${formatDate(booking.bookingDate)}</small>
                </div>
                <span class="pnr-status ${booking.status}">${booking.status.toUpperCase()}</span>
            </div>
            <div class="pnr-details">
                <p><strong>${booking.trainName}</strong> (#${booking.trainNumber})</p>
                <p>${booking.from} → ${booking.to}</p>
                <p>Date: ${formatDate(booking.date)} | Class: ${booking.travelClass}</p>
                <p>Departure: ${booking.departure}</p>
                <hr style="border-color: rgba(255,255,255,0.1); margin: 1rem 0;">
                <h4>Passengers:</h4>
                ${booking.passengers.map((p, i) => `
                    <p>${i + 1}. ${p.name} (${p.gender}, ${p.age}yrs) - ${p.berth}</p>
                `).join('')}
            </div>
        </div>`;
}

// ========== MY BOOKINGS ==========
function displayBookings(filter = 'all') {
    const listDiv = document.getElementById('booked-list');
    let bookings = currentUser ? 
        DB.getUserBookings(currentUser.email) : 
        DB.getBookings();
    
    if (filter !== 'all') {
        bookings = bookings.filter(b => b.status === filter);
    }
    
    // Sort by booking date (newest first)
    bookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
    
    if (bookings.length === 0) {
        listDiv.innerHTML = `
            <div class="no-results">
                <h3>📭 No bookings found</h3>
                <p>${currentUser ? 'Book a ticket to get started!' : 'Login to see your bookings'}</p>
            </div>`;
        return;
    }
    
    listDiv.innerHTML = '';
    bookings.forEach(booking => {
        listDiv.innerHTML += `
            <div class="ticket-card ${booking.status}">
                <div class="ticket-details">
                    <h3>${booking.trainName}</h3>
                    <p>${booking.from} → ${booking.to}</p>
                    <p>Date: ${formatDate(booking.date)} | ${booking.travelClass}</p>
                    <p>PNR: <span class="ticket-pnr">${booking.pnr}</span></p>
                    <small>${booking.passengers.length} passenger(s) | ₹${booking.totalPrice}</small>
                </div>
                <div class="ticket-actions">
                    <button class="view-btn" onclick="showTicket(DB.getBookingByPNR('${booking.pnr}'))">View Ticket</button>
                    ${booking.status === 'confirmed' ? 
                        `<button class="cancel-btn" onclick="cancelBooking('${booking.pnr}')">Cancel</button>` : 
                        '<span style="color: #f87171;">Cancelled</span>'}
                </div>
            </div>`;
    });
}

function filterBookings(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    displayBookings(filter);
}

function cancelBooking(pnr) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    const result = DB.cancelBooking(pnr);
    if (result) {
        showToast('Booking cancelled successfully', 'success');
        displayBookings();
    } else {
        showToast('Failed to cancel booking', 'error');
    }
}

// ========== TICKET DISPLAY ==========
function showTicket(booking) {
    const content = document.getElementById('ticket-content');
    
    content.innerHTML = `
        <div class="ticket-display" id="printable-ticket">
            <div class="header">
                <h2>🚂 RailReserve</h2>
                <p>E-Ticket / Reservation Slip</p>
            </div>
            <div class="details">
                <div class="detail-item">
                    <div class="label">PNR Number</div>
                    <div class="value">${booking.pnr}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Status</div>
                    <div class="value" style="color: ${booking.status === 'confirmed' ? 'green' : 'red'}">${booking.status.toUpperCase()}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Train</div>
                    <div class="value">${booking.trainName} (${booking.trainNumber})</div>
                </div>
                <div class="detail-item">
                    <div class="label">Class</div>
                    <div class="value">${booking.travelClass}</div>
                </div>
                <div class="detail-item">
                    <div class="label">From</div>
                    <div class="value">${booking.from}</div>
                </div>
                <div class="detail-item">
                    <div class="label">To</div>
                    <div class="value">${booking.to}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Date</div>
                    <div class="value">${formatDate(booking.date)}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Departure</div>
                    <div class="value">${booking.departure}</div>
                </div>
            </div>
            <div style="margin-top: 1rem; border-top: 2px dashed #ccc; padding-top: 1rem;">
                <h4 style="margin-bottom: 0.5rem;">Passengers:</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background: #f0f0f0;">
                        <th style="padding: 8px; text-align: left;">Name</th>
                        <th style="padding: 8px;">Age</th>
                        <th style="padding: 8px;">Gender</th>
                        <th style="padding: 8px;">Berth</th>
                    </tr>
                    ${booking.passengers.map(p => `
                        <tr>
                            <td style="padding: 8px;">${p.name}</td>
                            <td style="padding: 8px; text-align: center;">${p.age}</td>
                            <td style="padding: 8px; text-align: center;">${p.gender}</td>
                            <td style="padding: 8px; text-align: center;">${p.berth}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
            <div class="pnr-code">
                <div>Total Fare</div>
                <div class="pnr" style="color: green;">₹${booking.totalPrice}</div>
            </div>
            <div class="barcode">||||| |||| ||||| |||| |||||</div>
            <p style="text-align: center; font-size: 0.8rem; margin-top: 1rem;">
                Booked on: ${formatDate(booking.bookingDate)}<br>
                Contact: ${booking.contactEmail}
            </p>
        </div>`;
    
    openModal('ticket-modal');
}

function printTicket() {
    const ticketContent = document.getElementById('printable-ticket').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Train Ticket - ${document.querySelector('.ticket-display .pnr')?.textContent || 'RailReserve'}</title>
            <style>
                body { font-family: 'Courier New', monospace; padding: 20px; }
                .header { text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 1rem; margin-bottom: 1rem; }
                .details { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .detail-item { padding: 0.5rem; }
                .label { font-size: 0.8rem; color: #666; }
                .value { font-weight: bold; font-size: 1.1rem; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; border: 1px solid #ddd; }
                th { background: #f0f0f0; }
                .pnr-code { text-align: center; margin-top: 1rem; padding-top: 1rem; border-top: 2px dashed #ccc; }
                .pnr { font-size: 1.5rem; font-weight: bold; color: green; }
            </style>
        </head>
        <body>${ticketContent}</body>
        </html>`);
    printWindow.document.close();
    printWindow.print();
}

function downloadTicket() {
    const ticket = document.getElementById('printable-ticket');
    const pnr = ticket.querySelector('.value')?.textContent || 'ticket';
    
    // Create a simple text version
    const textContent = ticket.innerText;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `RailReserve_Ticket_${pnr}.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('Ticket downloaded!', 'success');
}

// ========== ADMIN FUNCTIONS ==========
function showAdminTab(tab) {
    document.querySelectorAll('.admin-content').forEach(c => c.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`admin-${tab}`).style.display = 'block';
    event.target.classList.add('active');
    
    if (tab === 'trains') loadTrainsList();
    if (tab === 'bookings') loadAllBookings();
    if (tab === 'stats') loadStats();
}

function addTrain(event) {
    event.preventDefault();
    
    const days = Array.from(document.querySelectorAll('.days-checkboxes input:checked'))
        .map(cb => cb.value);
    
    if (days.length === 0) {
        showToast('Please select at least one running day', 'error');
        return;
    }
    
    const train = {
        number: document.getElementById('train-number').value,
        name: document.getElementById('train-name').value,
        from: document.getElementById('train-from').value,
        to: document.getElementById('train-to').value,
        departure: document.getElementById('departure-time').value,
        arrival: document.getElementById('arrival-time').value,
        duration: calculateDuration(
            document.getElementById('departure-time').value,
            document.getElementById('arrival-time').value
        ),
        days: days,
        classes: {
            'SL': { price: parseInt(document.getElementById('train-price').value), seats: parseInt(document.getElementById('total-seats').value) },
            '3A': { price: Math.round(parseInt(document.getElementById('train-price').value) * 2.5), seats: Math.round(parseInt(document.getElementById('total-seats').value) * 0.4) },
            '2A': { price: Math.round(parseInt(document.getElementById('train-price').value) * 3.5), seats: Math.round(parseInt(document.getElementById('total-seats').value) * 0.2) },
            '1A': { price: Math.round(parseInt(document.getElementById('train-price').value) * 6), seats: Math.round(parseInt(document.getElementById('total-seats').value) * 0.1) }
        }
    };
    
    DB.addTrain(train);
    showToast('Train added successfully!', 'success');
    document.getElementById('add-train-form').reset();
    loadTrainsList();
}

function calculateDuration(dep, arr) {
    const [depH, depM] = dep.split(':').map(Number);
    const [arrH, arrM] = arr.split(':').map(Number);
    
    let hours = arrH - depH;
    let mins = arrM - depM;
    
    if (mins < 0) { mins += 60; hours--; }
    if (hours < 0) hours += 24;
    
    return `${hours}h ${mins}m`;
}

function loadTrainsList() {
    const trains = DB.getTrains();
    const container = document.getElementById('trains-list');
    
    if (!container) return;
    
    container.innerHTML = trains.map(train => `
        <div class="train-card" style="grid-template-columns: 2fr 1fr 1fr auto;">
            <div class="train-info">
                <h3>${train.name}</h3>
                <span class="train-number">#${train.number}</span>
            </div>
            <div>
                <p>${train.from} → ${train.to}</p>
                <small>${train.departure} - ${train.arrival}</small>
            </div>
            <div>
                <small>Runs on: ${train.days.join(', ')}</small>
            </div>
            <button class="cancel-btn" onclick="deleteTrain('${train.id}')">Delete</button>
        </div>
    `).join('');
}

function deleteTrain(id) {
    if (!confirm('Are you sure you want to delete this train?')) return;
    DB.deleteTrain(id);
    showToast('Train deleted', 'success');
    loadTrainsList();
}

function loadAllBookings() {
    const bookings = DB.getBookings();
    const container = document.getElementById('all-bookings-list');
    
    if (!container) return;
    
    container.innerHTML = bookings.map(b => `
        <div class="ticket-card ${b.status}">
            <div class="ticket-details">
                <h3>PNR: ${b.pnr}</h3>
                <p>${b.trainName} | ${formatDate(b.date)}</p>
                <p>${b.from} → ${b.to}</p>
                <small>${b.passengers.length} passenger(s) | ₹${b.totalPrice} | ${b.contactEmail}</small>
            </div>
            <span class="pnr-status ${b.status}">${b.status.toUpperCase()}</span>
        </div>
    `).join('');
}

function loadStats() {
    const stats = DB.getStats();
    const container = document.getElementById('stats-grid');
    
    if (!container) return;
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="value">${stats.totalTrains}</div>
            <div class="label">Total Trains</div>
        </div>
        <div class="stat-card">
            <div class="value">${stats.totalBookings}</div>
            <div class="label">Total Bookings</div>
        </div>
        <div class="stat-card">
            <div class="value">${stats.confirmedBookings}</div>
            <div class="label">Confirmed</div>
        </div>
        <div class="stat-card">
            <div class="value">${stats.cancelledBookings}</div>
            <div class="label">Cancelled</div>
        </div>
        <div class="stat-card">
            <div class="value">${stats.totalUsers}</div>
            <div class="label">Registered Users</div>
        </div>
        <div class="stat-card">
            <div class="value">₹${stats.totalRevenue.toLocaleString()}</div>
            <div class="label">Total Revenue</div>
        </div>
        <div class="stat-card">
            <div class="value">${stats.totalPassengers}</div>
            <div class="label">Total Passengers</div>
        </div>
    `;
}

// ========== USER AUTHENTICATION ==========
function showLoginModal() {
    if (currentUser) {
        if (confirm('Do you want to logout?')) {
            logout();
        }
        return;
    }
    openModal('login-modal');
}

function switchTab(tab) {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const user = DB.authenticateUser(email, password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUserUI();
        closeModal('login-modal');
        showToast(`Welcome back, ${user.name}!`, 'success');
    } else {
        showToast('Invalid email or password', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('register-name').value,
        email: document.getElementById('register-email').value,
        phone: document.getElementById('register-phone').value,
        password: document.getElementById('register-password').value
    };
    
    const result = DB.createUser(userData);
    
    if (result.error) {
        showToast(result.error, 'error');
    } else {
        showToast('Registration successful! Please login.', 'success');
        switchTab('login');
        document.querySelector('.tabs .tab:first-child').classList.add('active');
        document.querySelector('.tabs .tab:last-child').classList.remove('active');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserUI();
    showToast('Logged out successfully', 'success');
}

function updateUserUI() {
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    
    if (currentUser) {
        userName.textContent = currentUser.name;
        userInfo.querySelector('button').textContent = 'Logout';
    } else {
        userName.textContent = 'Guest';
        userInfo.querySelector('button').textContent = 'Login';
    }
}

// ========== UTILITY FUNCTIONS ==========
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// Close modals on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}
