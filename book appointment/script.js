document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointmentForm');
    const phoneInput = document.getElementById('phoneNumber');
    const emailInput = document.getElementById('email');
    const hospitalSelect = document.getElementById('hospital');
    const medicalCategorySelect = document.getElementById('medicalCategory');

    // Phone number validation
    phoneInput.addEventListener('input', function(e) {
        const phoneNumber = e.target.value.replace(/\D/g, '');
        e.target.value = phoneNumber;
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate phone number
        if (phoneInput.value.length < 10) {
            alert('Please enter a valid phone number');
            return;
        }

        // Validate email if provided
        if (emailInput.value && !isValidEmail(emailInput.value)) {
            alert('Please enter a valid email address');
            return;
        }

        // Validate hospital selection
        if (!hospitalSelect.value) {
            alert('Please select a hospital');
            return;
        }

        // Validate medical category
        if (!medicalCategorySelect.value) {
            alert('Please select a medical category');
            return;
        }

        // Get selected day and time
        const selectedDay = document.querySelector('input[name="day"]:checked');
        const selectedTime = document.querySelector('input[name="time"]:checked');
        const selectedTransport = document.querySelector('input[name="transport"]:checked');

        if (!selectedDay || !selectedTime || !selectedTransport) {
            alert('Please select day, time, and transportation option');
            return;
        }

        // Get selected special needs
        const specialNeeds = [];
        document.querySelectorAll('input[name="disability"]:checked').forEach(checkbox => {
            specialNeeds.push(checkbox.value);
        });

        // Get the hospital value
        let hospitalValue = hospitalSelect.value;
        if (hospitalValue === 'custom') {
            hospitalValue = document.getElementById('customHospital').value;
        }

        // Collect form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            phoneNumber: phoneInput.value,
            email: emailInput.value,
            hospital: hospitalValue,
            medicalCategory: medicalCategorySelect.value,
            preferredDay: selectedDay.value,
            preferredTime: selectedTime.value,
            transportation: selectedTransport.value,
            specialNeeds: specialNeeds,
            gender: document.querySelector('input[name="gender"]:checked').value,
            reason: document.getElementById('reason').value
        };

        // Here you would typically send the data to a server
        console.log('Form submitted:', formData);
        
        // Show success message
        alert('Appointment booked successfully! We will contact you shortly to confirm.');
        form.reset();
    });

    // Email validation helper function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Add input validation styling
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.style.borderColor = 'red';
            } else {
                this.style.borderColor = '#ccc';
            }
        });
    });

    // Add this function at the end of your script.js file
    function toggleCustomHospital() {
        const hospitalSelect = document.getElementById('hospital');
        const customHospitalBox = document.getElementById('customHospitalBox');
        const customHospitalInput = document.getElementById('customHospital');

        if (hospitalSelect.value === 'custom') {
            customHospitalBox.style.display = 'block';
            customHospitalInput.required = true;
        } else {
            customHospitalBox.style.display = 'none';
            customHospitalInput.required = false;
        }
    }
});
