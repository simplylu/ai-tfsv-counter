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
const targetCount = Math.floor(elapsedHours * countsPerHour);

// Update counter display
function updateDisplay() {
    counterElement.textContent = currentCount.toLocaleString();
}

// Increment counter
function incrementCounter() {
    currentCount++;
    updateDisplay();
}

// Animate from 0 to current count over 10 seconds in 10k steps
const animationDuration = 5000; // 10 seconds
const largeStepSize = 20000;
const smallStepSize = 10;
const slowDownThreshold = 1000;

// Calculate timing for large steps (first 9 seconds)
const countToSlowDown = Math.max(0, targetCount - slowDownThreshold);
const numberOfLargeSteps = Math.ceil(countToSlowDown / largeStepSize);
const largeStepDuration = numberOfLargeSteps > 0 ? (9000 / numberOfLargeSteps) : 0;

// Calculate timing for small steps (last 1 second)
const remainingCount = Math.min(slowDownThreshold, targetCount);
const numberOfSmallSteps = Math.ceil(remainingCount / smallStepSize);
const smallStepDuration = numberOfSmallSteps > 0 ? (1000 / numberOfSmallSteps) : 0;

function animateCounter() {
    if (currentCount < targetCount) {
        const remaining = targetCount - currentCount;
        
        if (remaining > slowDownThreshold) {
            // Use large steps
            currentCount = Math.min(currentCount + largeStepSize, targetCount - slowDownThreshold);
            updateDisplay();
            setTimeout(animateCounter, largeStepDuration);
        } else {
            // Use small steps for final approach
            currentCount = Math.min(currentCount + smallStepSize, targetCount);
            updateDisplay();
            
            if (currentCount < targetCount) {
                setTimeout(animateCounter, smallStepDuration);
            } else {
                // Animation complete, start normal counting
                setInterval(incrementCounter, intervalMs);
            }
        }
    }
}

// Initial display (will show 0)
updateDisplay();

// Consent popup handling
const consentOverlay = document.getElementById('consent-overlay');
const mainContent = document.getElementById('main-content');
const consentYes = document.getElementById('consent-yes');
const consentNo = document.getElementById('consent-no');

consentYes.addEventListener('click', () => {
    consentOverlay.classList.add('hidden');
    mainContent.classList.remove('blurred');
    // Start animation after consent
    animateCounter();
});

consentNo.addEventListener('click', () => {
    window.location.href = 'cat.html';
});
