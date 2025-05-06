# AI-Powered Hospital Management Platform

> Smarter, Faster, and Closer Healthcare for Ethiopia

---

## Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Acknowledgments](#acknowledgments)

---

## About the Project
The **AI-Powered Hospital Management Platform** is a digital solution aimed at transforming healthcare access in Ethiopia. This platform enables patients to book appointments online, access their medical history securely, and interact with an AI assistant for help — all with just a few clicks. By leveraging **AI and free APIs**, the platform helps eliminate hospital overcrowding, reduces paperwork, and makes healthcare more accessible to people across Ethiopia.

---

## Features
- **Online Appointment Booking**: Patients can easily book doctor appointments, reducing waiting times.
- **Digital Medical Profiles**: Secure, user-specific profiles that store patient medical history, retrievable via a unique ID.
- **AI Assistant**: A simple chatbot to guide users through the platform and answer common healthcare questions.
- **Mobile-Friendly**: Fully responsive design for easy use on any device.

---

## Tech Stack
- **Frontend**: HTML5, CSS3 (Flexbox, Grid), Vanilla JavaScript (ES6)
- **Free APIs**: Utilized for patient data storage, appointment handling, and chatbot functionality
- **Libraries/Tools**: No backend; client-side only with external APIs

---

## Setup
1. Clone this repository:
    ```bash
    git clone https://github.com/your-username/Smart-healthcare.git
    ```

2. Open `index.html` directly in your browser to view the platform.  
   (No backend required; the project is entirely frontend.)

---

## Usage
- **Homepage**: Navigate to the home page for an overview of the platform and access quick links.
- **Appointment Page**: Book doctor appointments online using the simple form.
- **Profile Page**: View your medical history by entering your unique ID.
- **About Us Page**: Learn more about the mission and vision behind this project.
- **AI Assistant**: Chat with the AI assistant for help in navigating the platform.

---

## Project Structure
```
smart-healthcare/
├── Home page/                    # Main landing page
│   ├── index.html               # Home page HTML
│   ├── styles.css               # Home page styles
│   └── script.js                # Home page functionality
│
├── SignIn page/                  # Authentication system
│   ├── index.html               # Sign in page HTML
│   ├── style.css                # Sign in page styles
│   └── script.js                # Authentication logic
│
├── Appointment Page/            # Appointment management
│   ├── index.html              # Appointment booking interface
│   ├── styles.css              # Appointment page styles
│   └── script.js               # Appointment handling logic
│
├── Profile Page/                # User profile management
│   ├── index.html              # Profile interface
│   ├── styles.css              # Profile page styles
│   └── script.js               # Profile data handling
│
├── Personal Doctor/             # Doctor portal
│   ├── index.html              # Doctor dashboard
│   ├── styles.css              # Doctor portal styles
│   └── script.js               # Doctor portal functionality
│
├── Services/                    # Backend services
│   ├── girls.html              # Services interface
│   ├── girls.css               # Services styles
│   └── girls.js                # Services functionality
│
├── assets/                     # Static assets
│   ├── images/                 # Image assets
│   ├── icons/                  # Icon assets
│   └── fonts/                  # Custom fonts
│
├── .vscode/                    # VS Code configuration
├── .git/                       # Git repository data
├── .gitattributes             # Git attributes
├── LICENSE                     # MIT License file
└── README.md                   # Project documentation
```

---

## Acknowledgments
- **Free AI chatbot API** by [SalamAPI]([(https://selamapi.vercel.app/v1)]).
 
