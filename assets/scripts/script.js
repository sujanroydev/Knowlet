const semestersDiv = document.getElementById("semesters");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupBody = document.getElementById("popup-body");
const popupContent = document.getElementById("popup-content");
const imgPopup = document.getElementById("img-popup");
const popupImage = document.getElementById("popup-image");
const imgTitle = document.getElementById("img-title");
let notes = {d: "dff"};
let loader = document.getElementById("loader");
// JavaScript to read localStorage, populate the list, and calculate the animation width

(function () {
    const HISTORY_KEY = 'unit_page_history';
    const scrollContent = document.getElementById('scroll-content');

    // NEW: Function to generate a random Hex color
    function getRandomColor() {
        // Generates a random integer between 0 and 16777215 (FFFFFF in decimal)
        // Converts to a hex string and pads with leading zeros if necessary
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }
    
    // Helper function to format the timestamp
    function formatTime(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    }

    function renderScrollingHistory() {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        scrollContent.innerHTML = ''; // Clear loading message

        if (history.length === 0) {
            scrollContent.innerHTML = '<div class="empty-message-scroll">Your history is empty. Visit some unit pages to track them here!</div>';
            return;
        }

        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-scroll-item';
            
            // Get a random color
            const randomColor = getRandomColor();

            // Apply the random color for styling
            historyItem.style.backgroundColor = `rgba(255, 255, 255, 0.95)`; // Slightly off-white background
            historyItem.style.borderLeftColor = randomColor; // Vibrant color on the left border
            historyItem.style.boxShadow = `0 2px 5px ${randomColor}33`; // Subtle shadow matching the border color

            // Apply a staggered delay for the fade-in animation
            historyItem.style.animationDelay = `${index * 0.08}s`; 

            historyItem.innerHTML = `
                <a href="${item.url}" title="${item.title}" style="color: ${randomColor};">${item.title}</a>
                <span class="timestamp">${formatTime(item.timestamp)}</span>
            `;
            scrollContent.appendChild(historyItem);
        });

        // --- LOGIC FOR AUTO-SCROLLING (Remains the same) ---

        const itemWidth = 215; 
        const totalContentWidth = history.length * itemWidth;
        scrollContent.style.width = `${totalContentWidth}px`;
        
        const style = document.createElement('style');
        const marqueeFrames = `
            @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-${totalContentWidth}px); }
            }
        `;
        
        const duration = history.length * 3; 
        scrollContent.style.animationDuration = `${duration}s`;
        
        style.textContent = marqueeFrames;
        document.head.appendChild(style);
    }

    renderScrollingHistory();
})();
