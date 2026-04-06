// ==========================================
// DATABASE LAYER - Simulates Backend Database
// Uses LocalStorage for persistence
// Can easily be replaced with Firebase/Supabase
// ==========================================

const DB = {
    // Initialize database with default data
    init: function() {
        if (!localStorage.getItem('db_initialized')) {
            this.seedData();
            localStorage.setItem('db_initialized', 'true');
        }
    },

    // Seed initial data
    seedData: function() {
        // Default Stations
        const stations = [
            'Mumbai Central', 'New Delhi', 'Chennai Central', 'Kolkata', 
            'Bangalore', 'Hyderabad', 'Ahmedabad', 'Pune', 'Jaipur', 
            'Lucknow', 'Kanpur', 'Nagpur', 'Patna', 'Indore', 'Bhopal',
            'Visakhapatnam', 'Vadodara', 'Surat', 'Coimbatore', 'Kochi'
        ];
        localStorage.setItem('stations', JSON.stringify(stations));

        // Default Trains
        const trains = [
            {
                id: 'T001',
                number: '12951',
                name: 'Mumbai Rajdhani',
                from: 'Mumbai Central',
                to: 'New Delhi',
                departure: '16:35',
                arrival: '08:35',
                duration: '16h 00m',
                days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: {
                    'SL': { price: 755, seats: 500 },
                    '3A': { price: 1980, seats: 200 },
                    '2A': { price: 2875, seats: 100 },
                    '1A': { price: 4845, seats: 50 }
                }
            },
            {
                id: 'T002',
                number: '12301',
                name: 'Howrah Rajdhani',
                from: 'New Delhi',
                to: 'Kolkata',
                departure: '16:55',
                arrival: '09:55',
                duration: '17h 00m',
                days: ['Mon', 'Wed', 'Fri', 'Sun'],
                classes: {
                    'SL': { price: 680, seats: 450 },
                    '3A': { price: 1755, seats: 180 },
                    '2A': { price: 2580, seats: 90 },
                    '1A': { price: 4350, seats: 40 }
                }
            },
            {
                id: 'T003',
                number: '12621',
                name: 'Tamil Nadu Express',
                from: 'New Delhi',
                to: 'Chennai Central',
                departure: '22:30',
                arrival: '07:10',
                duration: '32h 40m',
                days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: {
                    'SL': { price: 620, seats: 600 },
                    '3A': { price: 1650, seats: 250 },
                    '2A': { price: 2380, seats: 120 },
                    '1A': { price: 4020, seats: 60 }
                }
            },
            {
                id: 'T004',
                number: '12259',
                name: 'Sealdah Duronto',
                from: 'New Delhi',
                to: 'Kolkata',
                departure: '12:45',
                arrival: '05:45',
                duration: '17h 00m',
                days: ['Tue', 'Thu', 'Sat'],
                classes: {
                    '3A': { price: 1855, seats: 200 },
                    '2A': { price: 2680, seats: 100 },
                    '1A': { price: 4500, seats: 50 }
                }
            },
            {
                id: 'T005',
                number: '12627',
                name: 'Karnataka Express',
                from: 'New Delhi',
                to: 'Bangalore',
                departure: '21:20',
                arrival: '06:40',
                duration: '33h 20m',
                days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: {
                    'SL': { price: 595, seats: 550 },
                    '3A': { price: 1580, seats: 220 },
                    '2A': { price: 2280, seats: 110 },
                    '1A': { price: 3850, seats: 55 }
                }
            },
            {
                id: 'T006',
                number: '12431',
                name: 'Hazrat Nizamuddin Rajdhani',
                from: 'Chennai Central',
                to: 'New Delhi',
                departure: '06:10',
                arrival: '10:55',
                duration: '28h 45m',
                days: ['Wed', 'Sat'],
                classes: {
                    '3A': { price: 2350, seats: 180 },
                    '2A': { price: 3420, seats: 90 },
                    '1A': { price: 5780, seats: 45 }
                }
            },
            {
                id: 'T007',
                number: '11301',
                name: 'Udyan Express',
                from: 'Mumbai Central',
                to: 'Bangalore',
                departure: '08:05',
                arrival: '08:00',
                duration: '23h 55m',
                days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: {
                    'SL': { price: 445, seats: 480 },
                    '3A': { price: 1180, seats: 200 },
                    '2A': { price: 1680, seats: 100 }
                }
            },
            {
                id: 'T008',
                number: '12839',
                name: 'Chennai Mail',
                from: 'Mumbai Central',
                to: 'Chennai Central',
                departure: '21:40',
                arrival: '19:05',
                duration: '21h 25m',
                days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                classes: {
                    'SL': { price: 485, seats: 520 },
                    '3A': { price: 1280, seats: 210 },
                    '2A': { price: 1850, seats: 105 },
                    '1A': { price: 3100, seats: 50 }
                }
            }
        ];
        localStorage.setItem('trains', JSON.stringify(trains));

        // Empty bookings array
        localStorage.setItem('bookings', JSON.stringify([]));

        // Empty users array
        localStorage.setItem('users', JSON.stringify([]));
    },

    // ========== STATION OPERATIONS ==========
    getStations: function() {
        return JSON.parse(localStorage.getItem('stations')) || [];
    },

    // ========== TRAIN OPERATIONS ==========
    getTrains: function() {
        return JSON.parse(localStorage.getItem('trains')) || [];
    },

    getTrainById: function(id) {
        const trains = this.getTrains();
        return trains.find(t => t.id === id);
    },

    searchTrains: function(from, to, date, travelClass) {
        const trains = this.getTrains();
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        
        return trains.filter(train => {
            const matchesRoute = train.from.toLowerCase().includes(from.toLowerCase()) &&
                               train.to.toLowerCase().includes(to.toLowerCase());
            const runsOnDay = train.days.includes(dayOfWeek);
            const hasClass = !travelClass || train.classes[travelClass];
            
            return matchesRoute && runsOnDay && hasClass;
        });
    },

    addTrain: function(train) {
        const trains = this.getTrains();
        train.id = 'T' + String(trains.length + 1).padStart(3, '0');
        trains.push(train);
        localStorage.setItem('trains', JSON.stringify(trains));
        return train;
    },

    updateTrain: function(id, updates) {
        const trains = this.getTrains();
        const index = trains.findIndex(t => t.id === id);
        if (index !== -1) {
            trains[index] = { ...trains[index], ...updates };
            localStorage.setItem('trains', JSON.stringify(trains));
            return trains[index];
        }
        return null;
    },

    deleteTrain: function(id) {
        const trains = this.getTrains();
        const filtered = trains.filter(t => t.id !== id);
        localStorage.setItem('trains', JSON.stringify(filtered));
    },

    // ========== BOOKING OPERATIONS ==========
    getBookings: function() {
        return JSON.parse(localStorage.getItem('bookings')) || [];
    },

    getBookingByPNR: function(pnr) {
        const bookings = this.getBookings();
        return bookings.find(b => b.pnr === pnr);
    },

    getUserBookings: function(userEmail) {
        const bookings = this.getBookings();
        return bookings.filter(b => b.contactEmail === userEmail);
    },

    createBooking: function(bookingData) {
        const bookings = this.getBookings();
        
        // Generate PNR
        const pnr = this.generatePNR();
        
        const booking = {
            ...bookingData,
            pnr: pnr,
            bookingId: 'BK' + Date.now(),
            bookingDate: new Date().toISOString(),
            status: 'confirmed'
        };
        
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Update seat availability
        this.updateSeatAvailability(bookingData.trainId, bookingData.travelClass, bookingData.date, -bookingData.passengers.length);
        
        return booking;
    },

    cancelBooking: function(pnr) {
        const bookings = this.getBookings();
        const index = bookings.findIndex(b => b.pnr === pnr);
        
        if (index !== -1) {
            const booking = bookings[index];
            bookings[index].status = 'cancelled';
            bookings[index].cancellationDate = new Date().toISOString();
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            // Restore seat availability
            this.updateSeatAvailability(booking.trainId, booking.travelClass, booking.date, booking.passengers.length);
            
            return bookings[index];
        }
        return null;
    },

    generatePNR: function() {
        const chars = '0123456789';
        let pnr = '';
        for (let i = 0; i < 10; i++) {
            pnr += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pnr;
    },

    // ========== SEAT AVAILABILITY ==========
    getSeatAvailability: function(trainId, travelClass, date) {
        const key = `seats_${trainId}_${travelClass}_${date}`;
        const stored = localStorage.getItem(key);
        
        if (stored) {
            return parseInt(stored);
        }
        
        // Return default seats from train data
        const train = this.getTrainById(trainId);
        if (train && train.classes[travelClass]) {
            return train.classes[travelClass].seats;
        }
        return 0;
    },

    updateSeatAvailability: function(trainId, travelClass, date, change) {
        const key = `seats_${trainId}_${travelClass}_${date}`;
        const current = this.getSeatAvailability(trainId, travelClass, date);
        localStorage.setItem(key, String(current + change));
    },

    // ========== USER OPERATIONS ==========
    getUsers: function() {
        return JSON.parse(localStorage.getItem('users')) || [];
    },

    getUserByEmail: function(email) {
        const users = this.getUsers();
        return users.find(u => u.email === email);
    },

    createUser: function(userData) {
        const users = this.getUsers();
        
        // Check if user exists
        if (this.getUserByEmail(userData.email)) {
            return { error: 'User already exists' };
        }
        
        const user = {
            ...userData,
            id: 'U' + Date.now(),
            createdAt: new Date().toISOString()
        };
        
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        return user;
    },

    authenticateUser: function(email, password) {
        const user = this.getUserByEmail(email);
        if (user && user.password === password) {
            return { ...user, password: undefined };
        }
        return null;
    },

    // ========== STATISTICS ==========
    getStats: function() {
        const bookings = this.getBookings();
        const trains = this.getTrains();
        const users = this.getUsers();
        
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
        const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
        
        return {
            totalTrains: trains.length,
            totalBookings: bookings.length,
            confirmedBookings: confirmedBookings.length,
            cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
            totalUsers: users.length,
            totalRevenue: totalRevenue,
            totalPassengers: confirmedBookings.reduce((sum, b) => sum + b.passengers.length, 0)
        };
    },

    // ========== RESET DATABASE ==========
    reset: function() {
        localStorage.clear();
        this.init();
    }
};

// Initialize database on load
DB.init();
