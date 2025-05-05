document.addEventListener('DOMContentLoaded', function() {
        // Initialize data storage
        if (!localStorage.getItem('medicalHistory')) {
            localStorage.setItem('medicalHistory', JSON.stringify([]));
        }
        if (!localStorage.getItem('appointments')) {
            localStorage.setItem('appointments', JSON.stringify([]));
        }
        if (!localStorage.getItem('doctors')) {
            localStorage.setItem('doctors', JSON.stringify([]));
        }
        if (!localStorage.getItem('language')) {
            localStorage.setItem('language', 'en');
        }

        // Check registration
        const registrationModal = document.getElementById('registration-modal');
        const mainContainer = document.getElementById('main-container');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser) {
            registrationModal.style.display = 'flex';
            mainContainer.style.display = 'none';
        } else {
            registrationModal.style.display = 'none';
            mainContainer.style.display = 'block';
            loadPatientData();
            loadMedicalHistory();
            loadAppointments();
            loadDoctors();
            setLanguage(localStorage.getItem('language'));
        }

        // Profile picture upload
        const uploadBtn = document.getElementById('upload-profile-btn');
        const profileInput = document.getElementById('profile-picture');
        const profilePreview = document.getElementById('profile-preview');
        
        uploadBtn.addEventListener('click', function() {
            profileInput.click();
        });
        
        profileInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    profilePreview.src = event.target.result;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });

        // Registration form
        document.getElementById('registration-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const patientData = {
                profilePicture: profilePreview.src,
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                dob: document.getElementById('dob').value,
                gender: document.getElementById('gender').value,
                bloodType: document.getElementById('blood-type').value,
                address: document.getElementById('address').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                emergencyContact: document.getElementById('emergency-contact').value,
                emergencyPhone: document.getElementById('emergency-phone').value
            };
            
            localStorage.setItem('patientData', JSON.stringify(patientData));
            registrationModal.style.display = 'none';
            mainContainer.style.display = 'block';
            loadPatientData();
        });

        // Load patient data
        function loadPatientData() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                document.getElementById('patient-name').textContent = currentUser.name;
                document.getElementById('patient-info').textContent = 
                    `${currentUser.healthInfo?.age || 'Age not specified'} years old • ${currentUser.healthInfo?.gender || 'Gender not specified'} • ${currentUser.healthInfo?.bloodType || 'Blood type not specified'}`;
                
                if (currentUser.profilePicture) {
                    document.getElementById('patient-profile-img').src = currentUser.profilePicture;
                }
            }
        }

        // Tab functionality
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });

        // Medical History
        function loadMedicalHistory() {
            const historyList = document.getElementById('history-list');
            const medicalHistory = JSON.parse(localStorage.getItem('medicalHistory'));
            
            if (medicalHistory.length === 0) {
                historyList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-file-medical"></i>
                        <h3>No medical records yet</h3>
                        <p>Add your first medical record to get started</p>
                    </div>
                `;
                return;
            }
            
            historyList.innerHTML = '';
            medicalHistory.forEach((record, index) => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <h4>${record.title}</h4>
                    <p>${record.description}</p>
                    <div class="meta">
                        <span>${new Date(record.date).toLocaleDateString()} • ${record.specialty || 'General'}</span>
                        <button class="btn btn-danger" data-index="${index}">Delete</button>
                    </div>
                `;
                historyList.appendChild(historyItem);
            });
            
            // Add delete event listeners
            document.querySelectorAll('#history-list .btn-danger').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    deleteMedicalRecord(index);
                });
            });
        }
        
        function deleteMedicalRecord(index) {
            const medicalHistory = JSON.parse(localStorage.getItem('medicalHistory'));
            medicalHistory.splice(index, 1);
            localStorage.setItem('medicalHistory', JSON.stringify(medicalHistory));
            loadMedicalHistory();
        }

        // Add Medical Record Modal
        const addHistoryBtn = document.getElementById('add-history-btn');
        const addRecordModal = document.getElementById('add-record-modal');
        
        addHistoryBtn.addEventListener('click', function() {
            addRecordModal.style.display = 'flex';
        });
        
        document.getElementById('close-record-modal').addEventListener('click', function() {
            addRecordModal.style.display = 'none';
        });
        
        document.getElementById('cancel-record-btn').addEventListener('click', function() {
            addRecordModal.style.display = 'none';
        });
        
        document.getElementById('medical-record-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newRecord = {
                title: document.getElementById('record-title').value,
                date: document.getElementById('record-date').value,
                type: document.getElementById('record-type').value,
                specialty: document.getElementById('record-specialty').value,
                description: document.getElementById('record-description').value,
                attachment: document.getElementById('record-attachment').files[0]?.name || null
            };
            
            const medicalHistory = JSON.parse(localStorage.getItem('medicalHistory'));
            medicalHistory.push(newRecord);
            localStorage.setItem('medicalHistory', JSON.stringify(medicalHistory));
            
            addRecordModal.style.display = 'none';
            this.reset();
            loadMedicalHistory();
        });

        // Appointments
        function loadAppointments() {
            const appointments = JSON.parse(localStorage.getItem('appointments'));
            const now = new Date();
            
            // Upcoming appointments
            const upcomingAppointments = appointments.filter(apt => new Date(apt.date + 'T' + apt.time) > now);
            const upcomingTable = document.querySelector('#upcoming-appointments tbody');
            
            if (upcomingAppointments.length === 0) {
                upcomingTable.innerHTML = `
                    <tr class="empty-row">
                        <td colspan="5" class="empty-state">
                            <i class="fas fa-calendar-alt"></i>
                            <h3>No upcoming appointments</h3>
                            <p>Book your first appointment to get started</p>
                        </td>
                    </tr>
                `;
            } else {
                upcomingTable.innerHTML = '';
                upcomingAppointments.forEach((apt, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${new Date(apt.date).toLocaleDateString()}<br>${apt.time}</td>
                        <td>${apt.doctor}</td>
                        <td>${apt.specialty}</td>
                        <td>${apt.location}</td>
                        <td>
                            <button class="btn">Details</button>
                            <button class="btn btn-danger" data-index="${index}">Cancel</button>
                        </td>
                    `;
                    upcomingTable.appendChild(row);
                });
            }
            
            // Past appointments
            const pastAppointments = appointments.filter(apt => new Date(apt.date + 'T' + apt.time) <= now);
            const pastTable = document.querySelector('#past-appointments tbody');
            
            if (pastAppointments.length === 0) {
                pastTable.innerHTML = `
                    <tr class="empty-row">
                        <td colspan="5" class="empty-state">
                            <i class="fas fa-history"></i>
                            <h3>No past appointments</h3>
                            <p>Your past appointments will appear here</p>
                        </td>
                    </tr>
                `;
            } else {
                pastTable.innerHTML = '';
                pastAppointments.forEach((apt, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${new Date(apt.date).toLocaleDateString()}<br>${apt.time}</td>
                        <td>${apt.doctor}</td>
                        <td>${apt.specialty}</td>
                        <td>${apt.notes || 'No notes'}</td>
                        <td>
                            <button class="btn">Details</button>
                            <button class="btn">Records</button>
                        </td>
                    `;
                    pastTable.appendChild(row);
                });
            }
            
            // Add cancel event listeners
            document.querySelectorAll('#upcoming-appointments .btn-danger').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    cancelAppointment(index);
                });
            });
        }
        
        function cancelAppointment(index) {
            const appointments = JSON.parse(localStorage.getItem('appointments'));
            appointments.splice(index, 1);
            localStorage.setItem('appointments', JSON.stringify(appointments));
            loadAppointments();
        }

        // Book Appointment Modal
        const addAppointmentBtn = document.getElementById('add-appointment-btn');
        const addAppointmentModal = document.getElementById('add-appointment-modal');
        
        addAppointmentBtn.addEventListener('click', function() {
            // Populate doctors dropdown
            const doctorSelect = document.getElementById('appointment-doctor');
            doctorSelect.innerHTML = '<option value="">Select doctor</option>';
            
            const doctors = JSON.parse(localStorage.getItem('doctors'));
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.name;
                option.textContent = `${doctor.name} (${doctor.specialty})`;
                doctorSelect.appendChild(option);
            });
            
            addAppointmentModal.style.display = 'flex';
        });
        
        document.getElementById('close-appointment-modal').addEventListener('click', function() {
            addAppointmentModal.style.display = 'none';
        });
        
        document.getElementById('cancel-appointment-btn').addEventListener('click', function() {
            addAppointmentModal.style.display = 'none';
        });
        
        document.getElementById('appointment-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const doctorText = document.getElementById('appointment-doctor').value;
            const [doctor, specialty] = doctorText.split(' (');
            
            const newAppointment = {
                doctor: doctor,
                specialty: specialty.replace(')', ''),
                date: document.getElementById('appointment-date').value,
                time: document.getElementById('appointment-time').value,
                reason: document.getElementById('appointment-reason').value,
                location: 'Clinic', // Would normally get from doctor data
                notes: ''
            };
            
            const appointments = JSON.parse(localStorage.getItem('appointments'));
            appointments.push(newAppointment);
            localStorage.setItem('appointments', JSON.stringify(appointments));
            
            addAppointmentModal.style.display = 'none';
            this.reset();
            loadAppointments();
        });

        // Doctors
        function loadDoctors() {
            const doctorsList = document.querySelector('#doctors-list tbody');
            const doctors = JSON.parse(localStorage.getItem('doctors'));
            
            if (doctors.length === 0) {
                doctorsList.innerHTML = `
                    <tr class="empty-row">
                        <td colspan="5" class="empty-state">
                            <i class="fas fa-user-md"></i>
                            <h3>No doctors registered</h3>
                            <p>Add your first doctor to get started</p>
                        </td>
                    </tr>
                `;
                return;
            }
            
            doctorsList.innerHTML = '';
            doctors.forEach((doctor, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${doctor.name}</td>
                    <td>${doctor.specialty}</td>
                    <td>${doctor.hospital}</td>
                    <td>${doctor.phone || 'No phone'}</td>
                    <td>
                        <button class="btn">Contact</button>
                        <button class="btn btn-danger" data-index="${index}">Remove</button>
                    </td>
                `;
                doctorsList.appendChild(row);
            });
            
            // Add delete event listeners
            document.querySelectorAll('#doctors-list .btn-danger').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    deleteDoctor(index);
                });
            });
        }
        
        function deleteDoctor(index) {
            const doctors = JSON.parse(localStorage.getItem('doctors'));
            doctors.splice(index, 1);
            localStorage.setItem('doctors', JSON.stringify(doctors));
            loadDoctors();
        }

        // Add Doctor Modal
        const addDoctorBtn = document.getElementById('add-doctor-btn');
        const addDoctorModal = document.getElementById('add-doctor-modal');
        
        addDoctorBtn.addEventListener('click', function() {
            addDoctorModal.style.display = 'flex';
        });
        
        document.getElementById('close-doctor-modal').addEventListener('click', function() {
            addDoctorModal.style.display = 'none';
        });
        
        document.getElementById('cancel-doctor-btn').addEventListener('click', function() {
            addDoctorModal.style.display = 'none';
        });
        
        document.getElementById('doctor-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newDoctor = {
                name: document.getElementById('doctor-name').value,
                specialty: document.getElementById('doctor-specialty').value,
                hospital: document.getElementById('doctor-hospital').value,
                phone: document.getElementById('doctor-phone').value,
                email: document.getElementById('doctor-email').value,
                address: document.getElementById('doctor-address').value
            };
            
            const doctors = JSON.parse(localStorage.getItem('doctors'));
            doctors.push(newDoctor);
            localStorage.setItem('doctors', JSON.stringify(doctors));
            
            addDoctorModal.style.display = 'none';
            this.reset();
            loadDoctors();
        });

        // Language Selector
        function setLanguage(lang) {
            localStorage.setItem('language', lang);
            // In a real app, you would implement actual translations here
            document.querySelector('.language-btn i').nextSibling.textContent = 
                lang === 'en' ? 'English' : 
                lang === 'es' ? 'Español' : 
                lang === 'fr' ? 'Français' : 'Deutsch';
        }
        
        document.querySelectorAll('.language-dropdown a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                setLanguage(lang);
                document.querySelector('.language-dropdown').style.display = 'none';
            });
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Display user information
        const userData = JSON.parse(sessionStorage.getItem('profileUserData'));
        
        if (userData) {
            // Update profile information
            document.getElementById('patient-name').textContent = `${userData.firstName} ${userData.lastName}`;
            document.getElementById('patient-info').textContent = `${userData.age || 'N/A'} years old • ${userData.gender || 'N/A'} • ${userData.bloodType || 'N/A'}`;
            
            // Update profile image if available
            if (userData.profileImage) {
                document.getElementById('patient-profile-img').src = userData.profileImage;
            }
            
            // Update contact information
            document.getElementById('email').textContent = userData.email || 'N/A';
            document.getElementById('phone').textContent = userData.phone || 'N/A';
            document.getElementById('address').textContent = userData.address || 'N/A';
            
            // Update emergency contact information
            document.getElementById('emergency-contact').textContent = userData.emergencyContact || 'N/A';
            document.getElementById('emergency-phone').textContent = userData.emergencyPhone || 'N/A';
        } else {
            // If no user data, redirect to sign in
            window.location.href = '../SignIn page/index.html';
        }
    });
