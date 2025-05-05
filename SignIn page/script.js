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

    // Modal functionality
    const modal = document.getElementById('registration-modal');
    const newUserLink = document.getElementById('new-user-link');
    const closeModal = document.querySelector('.close-modal');

    newUserLink.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Profile photo upload functionality
    const profilePhoto = document.getElementById('profile-photo');
    const profilePreview = document.getElementById('profile-preview');
    let profilePhotoData = null;

    profilePhoto.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                profilePreview.src = event.target.result;
                profilePhotoData = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Registration form handling
    const registrationForm = document.getElementById('registration-form');
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect registration data
        const userData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            profilePicture: profilePhotoData || 'https://via.placeholder.com/150',
            healthInfo: {
                bloodType: document.getElementById('blood-type').value,
                allergies: document.getElementById('allergies').value,
                medications: document.getElementById('medications').value,
                conditions: document.getElementById('conditions').value
            }
        };

        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Close modal and show success message
        modal.style.display = 'none';
        
        // Create and show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Account created successfully! Please sign in with your new account.</p>
        `;
        document.querySelector('.container').appendChild(successMessage);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
        
        registrationForm.reset();
        profilePreview.src = 'https://via.placeholder.com/150';
        profilePhotoData = null;
    });

    // Sign in form handling
    const signinForm = document.getElementById('signin-form');
    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Check if user exists
        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
            alert('No account found. Please create an account first.');
            modal.style.display = 'block';
            return;
        }

        const userData = JSON.parse(storedUserData);
        if (email !== userData.email || password !== userData.password) {
            alert('Invalid email or password');
            return;
        }

        // Store current user session with all necessary data
        localStorage.setItem('currentUser', JSON.stringify({
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            profilePicture: userData.profilePicture || 'https://via.placeholder.com/60',
            healthInfo: {
                age: userData.age || 'Not specified',
                gender: userData.gender || 'Not specified',
                bloodType: userData.healthInfo?.bloodType || 'Not specified',
                allergies: userData.healthInfo?.allergies || 'None',
                medications: userData.healthInfo?.medications || 'None',
                conditions: userData.healthInfo?.conditions || 'None'
            }
        }));

        // Redirect to home page
        window.location.href = '../Home page/index.html';
    });

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