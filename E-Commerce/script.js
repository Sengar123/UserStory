let currentUser = null;
let users = [];
let bookings = [];
let currentPage = 1;
const itemsPerPage = 5;

// Page elements
const registrationForm = document.getElementById('registrationForm');
const loginForm = document.getElementById('loginForm');
const servicesPage = document.getElementById('servicesPage');
const historyPage = document.getElementById('historyPage');
const historyBody = document.getElementById('historyBody');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
//const welcomeMessage = document.getElementById('welcomeMessage');
const welcomeMessage = document.getElementById('welcomeMessage');  // Get welcome message element

// Page navigation
document.getElementById('registerLink').addEventListener('click', () => {
    hideAcknowledgments(); // Hide any acknowledgment boxes
    hideWelcomeMessage(); // Hide the welcome message
    showPage('registrationForm');
});

document.getElementById('loginLink').addEventListener('click', () => {
    hideAcknowledgments(); // Hide any acknowledgment boxes
    hideWelcomeMessage(); // Hide the welcome message
    showPage('loginForm');
});

document.getElementById('servicesLink').addEventListener('click', () => {
    hideAcknowledgments(); // Hide any acknowledgment boxes
    hideWelcomeMessage(); // Hide the welcome message
    if (currentUser) {
        showPage('servicesPage');
    } else {
        alert("Please log in first.");
    }
});

document.getElementById('historyLink').addEventListener('click', () => {
    hideAcknowledgments(); // Hide any acknowledgment boxes
    hideWelcomeMessage(); // Hide the welcome message
    if (currentUser) {
        showPage('historyPage');
        renderHistory();
    } else {
        alert("Please log in first.");
    }
});

// Show page function
// Show page function
function showPage(pageId) {
    const pages = [registrationForm, loginForm, servicesPage, historyPage];
    pages.forEach(page => {
        page.style.display = page.id === pageId ? 'block' : 'none';
    });
    welcomeMessage.style.display = 'block'; // Keep the welcome message visible
}


// Function to hide acknowledgment boxes
function hideAcknowledgments() {
    document.getElementById('registrationAck').style.display = 'none';
    document.getElementById('serviceAck').style.display = 'none';
}

// Function to hide welcome message
function hideWelcomeMessage() {
    welcomeMessage.style.display = 'none';
}

// Show the welcome message initially
welcomeMessage.style.display = 'block';

// Registration
document.getElementById('registerBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const address = document.getElementById('address').value.trim();
    const contact = document.getElementById('contact').value.trim();

    // Validate username (should not be empty)
    if (username === "") {
        alert("Username should not be empty.");
        return;
    }

    // Validate email (should follow valid email pattern)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Validate password (should follow password guidelines)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, #, $, etc.).");
        return;
    }

    // Validate contact number (should be exactly 10 digits)
    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(contact)) {
        alert("Contact number should be exactly 10 digits.");
        return;
    }

    // Generate a random user ID
    const userId = Math.floor(Math.random() * 10000);

    // Create user object
    const user = { userId, username, email, password, address, contact };

    // Save user data to localStorage
    // First, retrieve any existing users from localStorage
    const storedUsers = localStorage.getItem('users');
    let users = storedUsers ? JSON.parse(storedUsers) : [];

    // Add the new user to the users array
    users.push(user);

    // Store the updated users array back in localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Display acknowledgment
    document.getElementById('ackUserId').innerText = `User ID: ${userId}`;
    document.getElementById('ackUsername').innerText = `Username: ${username}`;
    document.getElementById('ackEmail').innerText = `Email: ${email}`;

    // Clear the form fields
    document.getElementById('username').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
    document.getElementById('address').value = "";
    document.getElementById('contact').value = "";

    // Hide registration form and show acknowledgment
    registrationForm.style.display = 'none';
    document.getElementById('registrationAck').style.display = 'block';
});


// Login
document.getElementById('loginBtn').addEventListener('click', () => {
    const loginUserId = document.getElementById('loginUserId').value.trim();
    const loginPassword = document.getElementById('loginPassword').value.trim();

    // Retrieve users from localStorage
    const storedUsers = localStorage.getItem('users');
    let users = storedUsers ? JSON.parse(storedUsers) : [];

    // Check if the entered credentials match any user in localStorage
    const user = users.find(u => u.userId.toString() === loginUserId && u.password === loginPassword);

    if (user) {
        // User found, proceed with login
        alert("Login Successful!");
        currentUser = user; // Store the logged-in user
        hideWelcomeMessage(); // Hide the welcome message upon login if necessary
        showPage('servicesPage'); // Show the services page after login
    } else {
        // User not found or invalid credentials
        alert("Invalid User ID or password.");
    }

    // Clear the form fields after login attempt
    document.getElementById('loginUserId').value = "";
    document.getElementById('loginPassword').value = "";
});

// Book Service
// Book a Service
document.getElementById('bookServiceBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const serviceType = document.getElementById('serviceType').value;
    const serviceDate = document.getElementById('serviceDate').value;
    const serviceSlot = document.getElementById('serviceSlot').value;
    const serviceAddress = document.getElementById('serviceAddress').value;
    const serviceVendor = document.getElementById('serviceVendor').value;
    const serviceAmount = document.getElementById('serviceAmount').value;
   
    // Validation checks
    if (serviceDate === "") {
        alert("Service Date should not be empty.");
        return;
    }
    if (serviceAddress === "") {
        alert("Service Address should not be empty.");
        return;
    }
    if (serviceVendor === "") {
        alert("Service Vendor should not be empty.");
        return;
    }

    const serviceId = Math.floor(Math.random() * 10000);

    // Get existing bookings from localStorage
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    // Add new booking
    const newBooking = { 
        userId: currentUser.userId, 
        username: currentUser.username, 
        serviceId,  
        serviceType, 
        serviceDate, 
        serviceSlot, 
        serviceAddress, 
        serviceVendor, 
        serviceAmount, 
        status: 'Confirmed' 
    };

    bookings.push(newBooking);

    // Save updated bookings back to localStorage
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Display acknowledgment
    document.getElementById('ackServiceId').innerText = `Service ID: ${serviceId}`;
    document.getElementById('ackVendor').innerText = `Vendor: ${serviceVendor}`;
    document.getElementById('ackServiceType').innerText = `Service Type: ${serviceType}`;
    
    servicesPage.style.display = 'none';
    document.getElementById('serviceAck').style.display = 'block';

    // Clear the form inputs after booking
    document.getElementById('serviceType').value = '';
    document.getElementById('serviceDate').value = '';
    document.getElementById('serviceSlot').value = '';
    document.getElementById('serviceAddress').value = '';
    document.getElementById('serviceVendor').value = '';

    // Re-render the booking history
    renderHistory();
});

// Render History
function renderHistory() {
    // Retrieve all bookings from localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    // Filter bookings by the current user's ID
    const userBookings = bookings.filter(booking => booking.userId === currentUser.userId);
    const totalPages = Math.ceil(userBookings.length / itemsPerPage);

    // Display current page bookings
    historyBody.innerHTML = '';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, userBookings.length);

    for (let i = startIndex; i < endIndex; i++) {
        const booking = userBookings[i];
        const row = `<tr>
            <td> ${booking.userId} </td>
            <td> ${booking.username} </td>
            <td>${booking.serviceId}</td>
            <td>${booking.serviceDate}</td>
            <td>${booking.serviceSlot}</td>
            <td>${booking.serviceType}</td>
            <td>${booking.status}</td>
        </tr>`;
        historyBody.innerHTML += row;
    }

    // Manage pagination buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

// Pagination
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderHistory();
    }
});

nextPageBtn.addEventListener('click', () => {
    const userBookings = bookings.filter(booking => booking.userId === currentUser.userId);
    const totalPages = Math.ceil(userBookings.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderHistory();
    }
});

// Initialize to show welcome message and login page on load
welcomeMessage.style.display = 'block';
showPage('loginForm');
