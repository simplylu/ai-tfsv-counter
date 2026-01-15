// Start from Linux timestamp 1765753200
const startTimestamp = 1766617200; // in seconds

// Audio setup
const audio = new Audio('beep.wav');
let soundEnabled = false;

const counterElement = document.getElementById('counter');
const countsPerHourX = 6700; // Count on X
const countsPerHourTop5 = 79; // Count on other top 5 platforms for porn content creation
const estimatedCountsForOSModels = 999 // Estimated counts for open source models

// Toggle states for different sources
let xEnabled = true;
let platformsEnabled = true;
let osModelsEnabled = true;

// Process URL hash to set initial toggle states
function processUrlHash() {
    const hash = window.location.hash.substring(1).toUpperCase();
    if (hash === 'X') {
        xEnabled = true;
        platformsEnabled = false;
        osModelsEnabled = false;
    } else if (hash === 'OS') {
        xEnabled = false;
        platformsEnabled = false;
        osModelsEnabled = true;
    } else if (hash === 'OTHER') {
        xEnabled = false;
        platformsEnabled = true;
        osModelsEnabled = false;
    }
    // If no hash or unrecognized hash, keep all enabled (default)
}

// Calculate counts per hour based on enabled toggles
function getCountsPerHour() {
    let total = 0;
    if (xEnabled) total += countsPerHourX;
    if (platformsEnabled) total += countsPerHourTop5;
    if (osModelsEnabled) total += estimatedCountsForOSModels;
    return total || 1; // Prevent division by zero
}

// Apply hash settings on page load BEFORE calculating values
processUrlHash();

let countsPerHour = getCountsPerHour();
let intervalMs = 3600000 / countsPerHour;
let counterInterval = null;

let currentCount = 0;

// Calculate initial count based on time elapsed since start timestamp
function getTargetCount() {
    const now = Math.floor(Date.now() / 1000);
    const elapsedSeconds = now - startTimestamp;
    const elapsedHours = elapsedSeconds / 3600;
    return Math.floor(elapsedHours * getCountsPerHour());
}

let targetCount = getTargetCount();

// Update counter display
function updateDisplay() {
    counterElement.textContent = currentCount.toLocaleString();
    
    // Play sound if enabled
    if (soundEnabled && currentCount > 0) {
        audio.currentTime = 0; // Reset to start
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
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
                counterInterval = setInterval(incrementCounter, intervalMs);
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
    // Update button visual states based on hash settings
    xToggle.classList.toggle('active', xEnabled);
    platformsToggle.classList.toggle('active', platformsEnabled);
    osModelsToggle.classList.toggle('active', osModelsEnabled);
    // Start animation after consent
    animateCounter();
    // Initialize rate display
    updateRateDisplay();
});

consentNo.addEventListener('click', () => {
    window.location.href = 'cat.html';
});

// Sound toggle button
const soundToggle = document.getElementById('sound-toggle');
const soundIcon = document.getElementById('sound-icon');

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    soundToggle.setAttribute('aria-label', soundEnabled ? 'Mute sound' : 'Unmute sound');
});

const catToggle = document.getElementById('cat-mode');

catToggle.addEventListener('click', () => {
    window.location.href = 'cat.html';
});

// Source toggle buttons
const xToggle = document.getElementById('x-toggle');
const platformsToggle = document.getElementById('platforms-toggle');
const osModelsToggle = document.getElementById('os-models-toggle');
const rateDisplay = document.getElementById('rate-display');

function updateRateDisplay() {
    const perHour = getCountsPerHour();
    const perSecond = (perHour / 3600).toFixed(2);
    rateDisplay.textContent = `${perHour} images per hour / ${perSecond} images per second`;
}

function updateCounterRate() {
    countsPerHour = getCountsPerHour();
    intervalMs = 3600000 / countsPerHour;
    
    // Clear existing interval and restart with new rate
    if (counterInterval) {
        clearInterval(counterInterval);
        counterInterval = setInterval(incrementCounter, intervalMs);
    }
    
    updateRateDisplay();
}

xToggle.addEventListener('click', () => {
    xEnabled = !xEnabled;
    xToggle.classList.toggle('active');
    updateCounterRate();
});

platformsToggle.addEventListener('click', () => {
    platformsEnabled = !platformsEnabled;
    platformsToggle.classList.toggle('active');
    updateCounterRate();
});

osModelsToggle.addEventListener('click', () => {
    osModelsEnabled = !osModelsEnabled;
    osModelsToggle.classList.toggle('active');
    updateCounterRate();
});

// Escape key handler
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        event.stopPropagation();
        console.log('Escape pressed, navigating to cat.html');
        window.location.assign('cat.html');
    }
}, true); // Use capture phase to ensure it fires even with overlay
