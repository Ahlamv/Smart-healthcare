document.addEventListener('DOMContentLoaded', function() {
    // Period Tracker Form Handling
    const periodForm = document.getElementById('periodForm');
    const reminderToggle = document.getElementById('reminderToggle');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    // Set max date to today
    const today = new Date().toISOString().split('T')[0];
    startDateInput.max = today;
    endDateInput.max = today;

    // Load saved period data from localStorage
    const savedPeriodData = JSON.parse(localStorage.getItem('periodData')) || {};
    if (savedPeriodData.startDate) {
        startDateInput.value = savedPeriodData.startDate;
    }
    if (savedPeriodData.endDate) {
        endDateInput.value = savedPeriodData.endDate;
    }
    if (savedPeriodData.reminderEnabled) {
        reminderToggle.checked = savedPeriodData.reminderEnabled;
    }

    // Handle form submission
    periodForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const reminderEnabled = reminderToggle.checked;

        // Validate dates
        if (!startDate || !endDate) {
            showAlert('Please enter both start and end dates', 'error');
            return;
        }

        // Validate date order
        if (new Date(endDate) < new Date(startDate)) {
            showAlert('End date cannot be before start date', 'error');
            return;
        }

        // Calculate period length
        const periodLength = calculateDaysBetween(startDate, endDate);
        if (periodLength > 10) {
            showAlert('Period length seems unusually long. Please verify your dates.', 'warning');
        }

        // Save to localStorage
        const periodData = {
            startDate,
            endDate,
            periodLength,
            reminderEnabled,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('periodData', JSON.stringify(periodData));

        // Show success message
        showAlert('Period tracked successfully!', 'success');
        
        // Update predictions
        updatePredictions();
    });

    // Handle reminder toggle
    reminderToggle.addEventListener('change', function() {
        const periodData = JSON.parse(localStorage.getItem('periodData')) || {};
        periodData.reminderEnabled = this.checked;
        localStorage.setItem('periodData', JSON.stringify(periodData));
        
        if (this.checked) {
            showAlert('Monthly reminders enabled', 'success');
        } else {
            showAlert('Monthly reminders disabled', 'info');
        }
    });

    // Calculate days between two dates
    function calculateDaysBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    }

    // Update predictions
    function updatePredictions() {
        const periodData = JSON.parse(localStorage.getItem('periodData'));
        if (!periodData || !periodData.startDate) return;

        const startDate = new Date(periodData.startDate);
        const nextPeriod = new Date(startDate);
        nextPeriod.setDate(nextPeriod.getDate() + 28); // Average cycle length

        const today = new Date();
        const daysUntilNextPeriod = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));

        // Remove existing prediction if any
        const existingPrediction = document.querySelector('.period-prediction');
        if (existingPrediction) {
            existingPrediction.remove();
        }

        if (daysUntilNextPeriod > 0) {
            const predictionElement = document.createElement('div');
            predictionElement.className = 'period-prediction';
            predictionElement.innerHTML = `
                <div class="prediction-content">
                    <i class="fas fa-calendar-check"></i>
                    <div>
                        <h4>Next Period Prediction</h4>
                        <p>Expected in ${daysUntilNextPeriod} days (around ${nextPeriod.toLocaleDateString()})</p>
                    </div>
                </div>
            `;
            periodForm.appendChild(predictionElement);
        }
    }

    // Show alert message
    function showAlert(message, type) {
        // Remove existing alert if any
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${type}`;
        alertElement.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 
                           type === 'warning' ? 'fa-exclamation-triangle' : 
                           type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;

        // Insert alert after the form
        periodForm.parentNode.insertBefore(alertElement, periodForm.nextSibling);

        // Remove alert after 5 seconds
        setTimeout(() => {
            alertElement.remove();
        }, 5000);
    }

    // Calculate next period if we have data
    updatePredictions();

    // Handle doctor consultation buttons
    document.querySelectorAll('.doctor-card button').forEach(button => {
        button.addEventListener('click', function() {
            const doctorName = this.closest('.doctor-card').querySelector('h3').textContent;
            alert(`Redirecting to appointment booking for ${doctorName}...`);
            // In a real implementation, this would redirect to the appointment booking page
            // window.location.href = '../Appointment Page/index.html';
        });
    });

    // Handle forum buttons
    document.querySelectorAll('.discussion-thread button').forEach(button => {
        button.addEventListener('click', function() {
            const threadTitle = this.closest('.discussion-thread').querySelector('h4').textContent;
            alert(`Joining ${threadTitle} discussion...`);
            // In a real implementation, this would redirect to the forum page
        });
    });
});
