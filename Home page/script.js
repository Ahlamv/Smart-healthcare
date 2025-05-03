// API Keys (Replace with your actual API keys)
const OPENAI_API_KEY = 'selam-cc2ffb45ff774d568422f84161b9d04d';
const OPENAI_BASE_URL = 'https://selamapi.vercel.app/v1';
const NUTRITIONIX_APP_ID = 'YOUR_NUTRITIONIX_APP_ID';
const NUTRITIONIX_APP_KEY = 'YOUR_NUTRITIONIX_APP_KEY';

// Chatbot API Configuration
const HUGGING_FACE_API_KEY = 'YOUR_HUGGING_FACE_API_KEY';
const API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

// API Configuration
const DEEPSEEK_API_KEY = 'YOUR_DEEPSEEK_API_KEY';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// DOM Elements
const chatModal = document.getElementById('chatModal');
const chatButton = document.getElementById('openChat');
const closeChat = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendMessage');
const signInModal = document.getElementById('signInModal');
const signInLink = document.getElementById('signInLink');
const closeModal = document.querySelector('.close');
const signInForm = document.getElementById('signInForm');
const header = document.querySelector('.header');

// Hamburger menu functionality for mobile
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== menuToggle) {
            nav.classList.remove('open');
        }
    });

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
        });
    });
}

// Chat Modal Functionality
// Show chat modal when chat button is clicked
chatButton.addEventListener('click', (e) => {
    e.stopPropagation();
    chatModal.style.display = 'flex';
});

// Close chat modal
function closeChatModal() {
    chatModal.style.display = 'none';
}

// Close button functionality
closeChat.addEventListener('click', (e) => {
    e.stopPropagation();
    closeChatModal();
});

// Close when clicking outside
document.addEventListener('click', (e) => {
    if (chatModal.style.display === 'flex' && 
        !chatModal.contains(e.target) && 
        e.target !== chatButton) {
        closeChatModal();
    }
});

// Prevent closing when clicking inside
chatModal.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Initialize chat
function initializeChat() {
    chatMessages.innerHTML = '';
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'message bot';
    welcomeMessage.innerHTML = `
        <p>Hello! I'm your AI health assistant. How can I help you today?</p>
        <div class="quick-answers">
            <button class="quick-answer" data-category="general">General Health</button>
            <button class="quick-answer" data-category="mental">Mental Health</button>
            <button class="quick-answer" data-category="women">Women's Health</button>
            <button class="quick-answer" data-category="preventive">Preventive Care</button>
        </div>
    `;
    chatMessages.appendChild(welcomeMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialize chat when page loads
initializeChat();

// Chat functionality
let chatHistory = [];

// Function to add a message to the chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to chat history
    chatHistory.push({
        role: isUser ? 'user' : 'assistant',
        content: message
    });
}

// Function to get AI response
async function getAIResponse(userMessage) {
    try {
        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot loading';
        loadingDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Prepare the messages array with chat history
        const messages = [
            { role: "system", content: "You are a helpful and knowledgeable health assistant. Provide accurate, clear, and concise health-related information. If you're unsure about something, say so and recommend consulting a healthcare professional." }
        ];

        // Add chat history
        chatHistory.forEach(msg => {
            messages.push({ role: msg.role, content: msg.content });
        });

        // Add the current user message
        messages.push({ role: "user", content: userMessage });

        console.log('Sending request to API with messages:', messages);

        // Make API call to OpenAI
        const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        console.log('API Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response data:', data);
        
        // Remove loading indicator
        chatMessages.removeChild(loadingDiv);

        // Add AI response
        const aiResponse = data.choices[0].message.content;
        addMessage(aiResponse);
    } catch (error) {
        console.error('Error getting AI response:', error);
        // Remove loading indicator if it exists
        if (chatMessages.querySelector('.loading')) {
            chatMessages.removeChild(chatMessages.querySelector('.loading'));
        }
        addMessage("I'm sorry, I'm having trouble processing your request. Please try again later. Error: " + error.message);
    }
}

// Handle send button click
sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        // Add user message
        addMessage(message, true);
        
        // Get AI response
        getAIResponse(message);
        
        // Clear input
        chatInput.value = '';
    }
});

// Handle enter key in chat input
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, true);
            
            // Get AI response
            getAIResponse(message);
            
            // Clear input
            chatInput.value = '';
        }
    }
});

// Handle quick answer clicks
document.querySelectorAll('.quick-answer').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        const message = `Tell me about ${category} health`;
        addMessage(message, true);
        getAIResponse(message);
    });
});

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Profile link functionality
    document.getElementById('profileLink').addEventListener('click', function(e) {
        e.preventDefault();
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            // Store user data in sessionStorage for the profile page
            sessionStorage.setItem('profileUserData', JSON.stringify(userData));
            // Navigate to profile page
            window.location.href = '../Profile Page/index.html';
        } else {
            // If no user data, redirect to sign in
            window.location.href = '../SignIn page/index.html';
        }
    });

    // Logout functionality
    signInLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Clear any stored user session data
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        // Redirect to sign in page
        window.location.href = '../SignIn page/index.html';
    });

    // Close button functionality
    closeModal.addEventListener('click', () => signInModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === signInModal) signInModal.style.display = 'none';
    });

    // Sign In Form
    signInForm.addEventListener('submit', handleSignIn);

    // Initialize Bootstrap components
    const signInModalBootstrap = new bootstrap.Modal(document.getElementById('signInModal'));
    
    // Book Appointment link handler
    document.getElementById('bookAppointmentLink').addEventListener('click', function(e) {
        e.preventDefault();
        // Add appointment booking logic here
        console.log('Navigate to appointment booking');
    });

    // Personal Doctor link handler
    document.getElementById('personalDoctorLink').addEventListener('click', function(e) {
        e.preventDefault();
        // Add personal doctor page navigation logic here
        console.log('Navigate to personal doctor');
    });

    // Service-related questions for the chatbot
    const serviceQuestions = {
        'reproductive-health': [
            'What are the common menstrual health issues?',
            'How can I track my fertility?',
            'What are the different family planning options?'
        ],
        'pregnancy-care': [
            'What should I expect during prenatal care?',
            'How can I prepare for childbirth?',
            'What are the important postnatal care tips?'
        ],
        'breast-health': [
            'How often should I get breast cancer screening?',
            'What are the early signs of breast cancer?',
            'How can I perform a self-breast examination?'
        ],
        'mental-wellness': [
            'What are common mental health issues in women?',
            'How can I manage stress and anxiety?',
            'What are the signs of postpartum depression?'
        ]
    };

    // Handle Learn More button clicks
    document.querySelectorAll('.learn-more').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const service = e.target.dataset.service;
            const questions = serviceQuestions[service];
            
            // Open chat modal
            chatModal.style.display = 'flex';
            
            // Clear existing messages
            chatMessages.innerHTML = '';
            
            // Add bot's initial message
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.innerHTML = `
                <p>I can help you with ${service.replace('-', ' ')}. Here are some common questions you might have:</p>
                <ul>
                    ${questions.map(q => `<li>${q}</li>`).join('')}
                </ul>
                <p>Feel free to ask any of these questions or ask something else!</p>
            `;
            chatMessages.appendChild(botMessage);
            
            // Focus on input
            chatInput.focus();
        });
    });
});

// Handle Sign In
function handleSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Here you would typically make an API call to your authentication service
    console.log('Sign in attempt with:', { email, password });
    
    // For demo purposes, we'll just close the modal
    signInModal.style.display = 'none';
}

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}); 