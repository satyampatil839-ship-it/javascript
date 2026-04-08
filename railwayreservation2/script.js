// Mock database of trains
const trains = [
    { id: 101, name: "Rajdhani Express", from: "Mumbai", to: "Delhi", time: "16:00" },
    { id: 102, name: "Duronto Express", from: "Mumbai", to: "Delhi", time: "23:00" },
    { id: 103, name: "Shatabdi Express", from: "Pune", to: "Mumbai", time: "06:00" },
    { id: 104, name: "Garib Rath", from: "Delhi", to: "Mumbai", time: "10:00" }
];

function searchTrains() {
    const fromInput = document.getElementById('from').value.trim();
    const toInput = document.getElementById('to').value.trim();
    const listContainer = document.getElementById('train-list');
    
    // Filter trains based on input
    const filtered = trains.filter(t => 
        t.from.toLowerCase() === fromInput.toLowerCase() && 
        t.to.toLowerCase() === toInput.toLowerCase()
    );

    // Clear previous results
    listContainer.innerHTML = "";

    if (filtered.length === 0) {
        listContainer.innerHTML = "<p>No trains found for this route.</p>";
        return;
    }

    // Generate HTML for each train found
    filtered.forEach(train => {
        const card = document.createElement('div');
        card.className = 'train-card';
        card.innerHTML = `
            <div class="train-info">
                <h4>${train.name} (#${train.id})</h4>
                <p>Departure: ${train.time} | Route: ${train.from} to ${train.to}</p>
            </div>
            <button onclick="bookTicket('${train.name}')">Book Now</button>
        `;
        listContainer.appendChild(card);
    });
}

function bookTicket(trainName) {
    alert(`Success! Your seat in ${trainName} has been reserved.`);
}