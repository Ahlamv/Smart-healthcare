const doctors = [
    {
        name: "Dr. Sarah Johnson",
        specialty: "Cardiologist",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        experience: "15 years",
        education: "Harvard Medical School",
        description: "Specialized in cardiovascular diseases and preventive cardiology."
    },
    {
        name: "Dr. Michael Chen",
        specialty: "Pediatrician",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        experience: "12 years",
        education: "Stanford Medical School",
        description: "Expert in child healthcare and development."
    },
    {
        name: "Dr. Emily Williams",
        specialty: "Dermatologist",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        experience: "10 years",
        education: "Yale School of Medicine",
        description: "Specialized in skin conditions and cosmetic dermatology."
    },
    {
        name: "Dr. James Wilson",
        specialty: "Neurologist",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        experience: "20 years",
        education: "Johns Hopkins School of Medicine",
        description: "Expert in neurological disorders and brain health."
    },
    {
        name: "Dr. Lisa Anderson",
        specialty: "Psychiatrist",
        image: "https://randomuser.me/api/portraits/women/5.jpg",
        experience: "14 years",
        education: "Columbia University",
        description: "Specialized in mental health and behavioral therapy."
    },
    {
        name: "Dr. Robert Taylor",
        specialty: "Orthopedic Surgeon",
        image: "https://randomuser.me/api/portraits/men/6.jpg",
        experience: "18 years",
        education: "UCLA Medical School",
        description: "Expert in joint replacement and sports medicine."
    },
    {
        name: "Dr. Maria Garcia",
        specialty: "Family Medicine",
        image: "https://randomuser.me/api/portraits/women/7.jpg",
        experience: "8 years",
        education: "University of Michigan",
        description: "Provides comprehensive primary care for all ages."
    },
    {
        name: "Dr. David Kim",
        specialty: "Endocrinologist",
        image: "https://randomuser.me/api/portraits/men/8.jpg",
        experience: "16 years",
        education: "Duke University",
        description: "Specialized in hormone-related conditions and diabetes."
    },
    {
        name: "Dr. Rachel Brown",
        specialty: "Ophthalmologist",
        image: "https://randomuser.me/api/portraits/women/9.jpg",
        experience: "13 years",
        education: "UCSF School of Medicine",
        description: "Expert in eye care and vision correction."
    },
    {
        name: "Dr. Thomas Martinez",
        specialty: "Pulmonologist",
        image: "https://randomuser.me/api/portraits/men/10.jpg",
        experience: "11 years",
        education: "Northwestern University",
        description: "Specialized in respiratory diseases and lung health."
    },
    {
        name: "Dr. Jennifer Lee",
        specialty: "OB/GYN",
        image: "https://randomuser.me/api/portraits/women/11.jpg",
        experience: "17 years",
        education: "University of Pennsylvania",
        description: "Expert in women's health and prenatal care."
    },
    {
        name: "Dr. William Parker",
        specialty: "Gastroenterologist",
        image: "https://randomuser.me/api/portraits/men/12.jpg",
        experience: "19 years",
        education: "Mayo Medical School",
        description: "Specialized in digestive system disorders."
    },
    {
        name: "Dr. Amanda White",
        specialty: "Allergist",
        image: "https://randomuser.me/api/portraits/women/13.jpg",
        experience: "9 years",
        education: "Emory University",
        description: "Expert in allergies and immunology."
    },
    {
        name: "Dr. Christopher Davis",
        specialty: "Urologist",
        image: "https://randomuser.me/api/portraits/men/14.jpg",
        experience: "15 years",
        education: "University of Washington",
        description: "Specialized in urinary tract and male reproductive health."
    },
    {
        name: "Dr. Michelle Thompson",
        specialty: "Rheumatologist",
        image: "https://randomuser.me/api/portraits/women/15.jpg",
        experience: "12 years",
        education: "Vanderbilt University",
        description: "Expert in autoimmune and joint diseases."
    }
];

function createDoctorCard(doctor) {
    return `
        <div class="doctor-card" onclick="showDoctorDetails('${doctor.name}')">
            <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image">
            <div class="doctor-info">
                <div class="doctor-name">${doctor.name}</div>
                <div class="doctor-specialty">${doctor.specialty}</div>
            </div>
        </div>
    `;
}

function displayDoctors(doctorsToShow) {
    const grid = document.getElementById('doctorsGrid');
    grid.innerHTML = doctorsToShow.map(doctor => createDoctorCard(doctor)).join('');
}

function searchDoctors() {
    const searchTerm = document.querySelector('.search-bar').value.toLowerCase();
    const filteredDoctors = doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm) || 
        doctor.specialty.toLowerCase().includes(searchTerm)
    );
    displayDoctors(filteredDoctors);
}

function showDoctorDetails(doctorName) {
    const doctor = doctors.find(d => d.name === doctorName);
    const modal = document.getElementById('doctorModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <img src="${doctor.image}" alt="${doctor.name}" style="width: 200px; border-radius: 10px; margin-bottom: 1rem;">
        <h2>${doctor.name}</h2>
        <p><strong>Specialty:</strong> ${doctor.specialty}</p>
        <p><strong>Experience:</strong> ${doctor.experience}</p>
        <p><strong>Education:</strong> ${doctor.education}</p>
        <p><strong>About:</strong> ${doctor.description}</p>
    `;
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('doctorModal').style.display = 'none';
}

displayDoctors(doctors);

window.onclick = function(event) {
    const modal = document.getElementById('doctorModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
