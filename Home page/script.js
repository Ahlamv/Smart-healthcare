// API Keys (Replace with your actual API keys)
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
const NUTRITIONIX_APP_ID = 'YOUR_NUTRITIONIX_APP_ID';
const NUTRITIONIX_APP_KEY = 'YOUR_NUTRITIONIX_APP_KEY';

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendMessage = document.getElementById('sendMessage');
const signInModal = document.getElementById('signInModal');
const signInLink = document.getElementById('signInLink');
const closeModal = document.querySelector('.close');
const signInForm = document.getElementById('signInForm');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Sign In Modal
    signInLink.addEventListener('click', () => signInModal.style.display = 'block');
    closeModal.addEventListener('click', () => signInModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === signInModal) signInModal.style.display = 'none';
    });

    // Chat functionality
    sendMessage.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });

    // Sign In Form
    signInForm.addEventListener('submit', handleSignIn);

    // Initialize Bootstrap components
    const signInModalBootstrap = new bootstrap.Modal(document.getElementById('signInModal'));
    
    // Event listeners for navbar links
    document.getElementById('profileLink').addEventListener('click', function(e) {
        e.preventDefault();
        // Add profile page navigation logic here
        console.log('Navigate to profile');
    });

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
});

// Handle User Messages
async function handleUserMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';

    // Process message and get AI response
    const response = await processMessage(message);
    addMessage(response, 'bot');
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Process message and get AI response
async function processMessage(message) {
    try {
        // Check if message contains food-related keywords
        if (message.toLowerCase().includes('nutrition') || message.toLowerCase().includes('food')) {
            return await getNutritionInfo(message);
        }
        // Check if message contains drug-related keywords
        else if (message.toLowerCase().includes('drug') || message.toLowerCase().includes('medicine')) {
            return await getDrugInfo(message);
        }
        // Use OpenAI for general health queries
        else {
            return await getAIResponse(message);
        }
    } catch (error) {
        console.error('Error processing message:', error);
        return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
}

// Get AI response using OpenAI
async function getAIResponse(message) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'system',
                    content: 'You are a helpful health assistant. Provide accurate and helpful health information.'
                }, {
                    role: 'user',
                    content: message
                }]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error getting AI response:', error);
        return 'I apologize, but I am unable to process your request at the moment.';
    }
}

// Get nutrition information using Nutritionix API
async function getNutritionInfo(query) {
    try {
        const response = await fetch(`https://api.nutritionix.com/v1_1/search/${encodeURIComponent(query)}?results=0:1&fields=item_name,nf_calories,nf_total_fat,nf_protein,nf_total_carbohydrate&appId=${NUTRITIONIX_APP_ID}&appKey=${NUTRITIONIX_APP_KEY}`);
        const data = await response.json();
        
        if (data.hits && data.hits.length > 0) {
            const item = data.hits[0].fields;
            return `Nutrition information for ${item.item_name}:\n` +
                   `Calories: ${item.nf_calories}\n` +
                   `Total Fat: ${item.nf_total_fat}g\n` +
                   `Protein: ${item.nf_protein}g\n` +
                   `Carbohydrates: ${item.nf_total_carbohydrate}g`;
        } else {
            return 'I couldn\'t find nutrition information for that item. Please try a different food item.';
        }
    } catch (error) {
        console.error('Error getting nutrition info:', error);
        return 'I apologize, but I am unable to retrieve nutrition information at the moment.';
    }
}

// Get drug information using OpenFDA API
async function getDrugInfo(query) {
    try {
        const response = await fetch(`https://api.fda.gov/drug/label.json?search=${encodeURIComponent(query)}&limit=1`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const drug = data.results[0];
            return `Information about ${drug.brand_name || 'this drug'}:\n` +
                   `Generic Name: ${drug.generic_name}\n` +
                   `Purpose: ${drug.purpose}\n` +
                   `Warnings: ${drug.warnings}\n` +
                   `Side Effects: ${drug.adverse_reactions}`;
        } else {
            return 'I couldn\'t find information about that drug. Please try a different drug name.';
        }
    } catch (error) {
        console.error('Error getting drug info:', error);
        return 'I apologize, but I am unable to retrieve drug information at the moment.';
    }
}

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