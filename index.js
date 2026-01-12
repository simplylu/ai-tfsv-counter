// Start from Linux timestamp 1765753200
const startTimestamp = 1766617200; // in seconds

const counterElement = document.getElementById('counter');
const countsPerHourX = 6700; // Count on X
const countsPerHourTop5 = 79; // Count on other top 5 platforms for porn content creation
const countsPerHour = countsPerHourX + countsPerHourTop5; // Total counts per hour
const intervalMs = 3600000 / countsPerHour;

let currentCount = 0;

// Calculate initial count based on time elapsed since start timestamp
const now = Math.floor(Date.now() / 1000); // current timestamp in seconds
const elapsedSeconds = now - startTimestamp;
const elapsedHours = elapsedSeconds / 3600;
currentCount = Math.floor(elapsedHours * countsPerHour);

// Update counter display
function updateDisplay() {
    counterElement.textContent = currentCount.toLocaleString();
}

// Increment counter
function incrementCounter() {
    currentCount++;
    updateDisplay();
}

// Initial display
updateDisplay();

// Start counting
setInterval(incrementCounter, intervalMs);

// Consent popup handling
const consentOverlay = document.getElementById('consent-overlay');
const mainContent = document.getElementById('main-content');
const consentYes = document.getElementById('consent-yes');
const consentNo = document.getElementById('consent-no');

consentYes.addEventListener('click', () => {
    consentOverlay.classList.add('hidden');
    mainContent.classList.remove('blurred');
});

consentNo.addEventListener('click', () => {
    window.location.href = 'cat.html';
});
