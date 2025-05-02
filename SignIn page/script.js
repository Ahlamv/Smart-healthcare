document.addEventListener('DOMContentLoaded', function() {
    // Form validation
    const form = document.querySelector('form');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        if (!emailInput.value || !passwordInput.value) {
            alert('Please fill in all fields');
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            alert('Please enter a valid email address');
            return;
        }

        // Password length validation
        if (passwordInput.value.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        // If validation passes, you can proceed with form submission
        console.log('Form submitted successfully');
        // Here you would typically send the data to your server
    });

    // Password visibility toggle
    const togglePassword = document.querySelector('.fa-eye');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-icon');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList[1];
            console.log(`Logging in with ${platform}`);
            // Here you would implement the social login logic
        });
    });
});