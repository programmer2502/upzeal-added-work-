/* ==========================================================================
   UPZEAL | CORE LOGIC OVERRIDE
   ========================================================================== */

// ── Strict Router ──
const handleRoute = () => {
    // 1. Nuke all active states
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    // 2. Read the current hash (default to #landing)
    let currentHash = window.location.hash || '#landing';

    // Check if target exists, fallback to landing
    if (!document.querySelector(currentHash)) {
        currentHash = '#landing';
        window.location.hash = currentHash;
    }

    // 3. Apply active state ONLY to the target
    const target = document.querySelector(currentHash);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }
};

// Listen for hash changes
window.addEventListener('hashchange', handleRoute);

// Run on initial load
document.addEventListener('DOMContentLoaded', handleRoute);
// Fallback if script loads late
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    handleRoute();
}

// ── Auth Forms (Prevent Default & Route) ──
const studentForm = document.getElementById('student-form');
if (studentForm) {
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent 404 / page reload
        window.location.hash = 'student-portal';
    });
}

const recruiterForm = document.getElementById('recruiter-form');
if (recruiterForm) {
    recruiterForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent 404 / page reload
        window.location.hash = 'recruiter-portal';
    });
}

const adminForm = document.getElementById('admin-dispatch-form');
if (adminForm) {
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Task assigned successfully');
        // We could add a visual success message here if needed
    });
}

// ── Live Components ──
// Digital Clock for Student Portal
const clockEl = document.getElementById('digital-clock');
if (clockEl) {
    setInterval(() => {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);
}
/* --- CHATBOT WIDGET LOGIC --- */

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    // Toggles the active class for the smooth CSS animation
    chatWindow.classList.toggle('active');
}

function handleChatSubmit(event) {
    event.preventDefault(); // Prevents page reload

    const inputField = document.getElementById('chat-input');
    const messageText = inputField.value.trim();

    if (messageText === "") return; // Don't send empty messages

    // 1. Render User Message
    appendMessage(messageText, 'user-message');
    inputField.value = ''; // Clear input

    // 2. Simulate AI Processing Delay (Mock Backend)
    setTimeout(() => {
        // You can replace this logic later with a real API call to an LLM
        generateBotResponse(messageText);
    }, 1000);
}

function appendMessage(text, senderClass) {
    const chatMessages = document.getElementById('chat-messages');

    // Create new bubble
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', senderClass);
    bubble.textContent = text;

    // Append and scroll to bottom
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(userText) {
    const lowerText = userText.toLowerCase();
    let response = "I'm your Upzeal Concierge. I can connect you with elite developers or help you begin your assessment journey.";

    // Basic Mock Logic (Replace with real LLM API later)
    if (lowerText.includes('hire') || lowerText.includes('recruiter')) {
        response = "Excellent. You can view our top-ranked candidates by logging into the Talent Explorer. Should I direct you there?";
    } else if (lowerText.includes('developer') || lowerText.includes('student')) {
        response = "Ready to prove your skills? Enter the Arena to begin your technical assessments and climb the global leaderboard.";
    }

    appendMessage(response, 'bot-message');
}

// Expose functions to window because app.js is loaded as a module
window.toggleChat = toggleChat;
window.handleChatSubmit = handleChatSubmit;

// ── Video Fade Loop Logic ──
const initHeroVideo = () => {
    const video = document.getElementById('hero-video');
    if (!video) return;

    let delayTimeout = null;

    const updateVideoOpacity = () => {
        if (!video.paused && !video.ended) {
            const curTime = video.currentTime;
            const duration = video.duration;

            if (duration && duration > 0) {
                const fadeDuration = 0.5; // 0.5s fade-in at start, 0.5s fade-out at end
                let opacity = 1;

                if (curTime < fadeDuration) {
                    opacity = curTime / fadeDuration;
                } else if (curTime > duration - fadeDuration) {
                    opacity = Math.max(0, (duration - curTime) / fadeDuration);
                }

                video.style.opacity = opacity;
            }
        }
        requestAnimationFrame(updateVideoOpacity);
    };

    video.addEventListener('ended', () => {
        video.style.opacity = '0';
        if (delayTimeout) clearTimeout(delayTimeout);
        delayTimeout = setTimeout(() => {
            video.currentTime = 0;
            video.play().catch(err => console.log('Video autoplay blocked:', err));
        }, 100);
    });

    // Start video playback and opacity animation loop
    video.play().then(() => {
        requestAnimationFrame(updateVideoOpacity);
    }).catch(err => {
        console.log('Video autoplay blocked or pending interaction:', err);
        // Fallback: requestAnimationFrame anyway so it updates once played
        requestAnimationFrame(updateVideoOpacity);
    });
};

// Initialize video
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initHeroVideo();
} else {
    document.addEventListener('DOMContentLoaded', initHeroVideo);
}