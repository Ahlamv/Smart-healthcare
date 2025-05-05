// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
    }
});

// Close menu when window is resized
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('open');
    }
});

// Period Tracker Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update profile icon with user's profile picture
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const profileIcon = document.getElementById('nav-profile-icon');
    
    if (currentUser && currentUser.profilePicture) {
        profileIcon.src = currentUser.profilePicture;
    }

    // Initialize period tracker
    const periodForm = document.getElementById('periodForm');
    const reminderToggle = document.getElementById('reminderToggle');
    
    // Load saved period data
    const savedPeriodData = JSON.parse(localStorage.getItem('periodData')) || {
        startDate: '',
        endDate: '',
        reminderEnabled: false
    };

    // Set form values from saved data
    if (savedPeriodData.startDate) {
        document.getElementById('startDate').value = savedPeriodData.startDate;
    }
    if (savedPeriodData.endDate) {
        document.getElementById('endDate').value = savedPeriodData.endDate;
    }
    if (savedPeriodData.reminderEnabled) {
        reminderToggle.checked = true;
    }

    // Handle form submission
    periodForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const reminderEnabled = reminderToggle.checked;

        if (!startDate || !endDate) {
            showAlert('Please enter both start and end dates', 'error');
            return;
        }

        // Save period data
        const periodData = {
            startDate,
            endDate,
            reminderEnabled
        };
        localStorage.setItem('periodData', JSON.stringify(periodData));

        // Calculate next period prediction
        const nextPeriod = calculateNextPeriod(startDate);
        
        // Show success message with next period prediction
        showAlert(`Period tracked successfully! Your next period is predicted to start around ${nextPeriod}`, 'success');

        // Set reminder if enabled
        if (reminderEnabled) {
            setReminder(nextPeriod);
        }
    });

    // Handle reminder toggle
    reminderToggle.addEventListener('change', function() {
        const periodData = JSON.parse(localStorage.getItem('periodData')) || {};
        periodData.reminderEnabled = this.checked;
        localStorage.setItem('periodData', JSON.stringify(periodData));
    });
});

// Calculate next period date (assuming 28-day cycle)
function calculateNextPeriod(startDate) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + 28); // Add 28 days to start date
    return date.toLocaleDateString();
}

// Set reminder for next period
function setReminder(nextPeriodDate) {
    // In a real application, you would use the browser's notification API
    // or integrate with a calendar service
    console.log(`Reminder set for next period on ${nextPeriodDate}`);
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    const periodTracker = document.querySelector('.period-tracker');
    periodTracker.insertBefore(alertDiv, periodTracker.firstChild);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
} 