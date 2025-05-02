document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const eyeIcons = document.querySelectorAll('.input-group i.fa-eye');

    eyeIcons.forEach((icon, index) => {
        icon.addEventListener('click', function() {
            const input = passwordInputs[index];
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Form validation
    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Here you would typically send the form data to your server
        // For now, we'll just show a success message
        alert('Account created successfully!');
        form.reset();
    });
});
