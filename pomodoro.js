// Pomodoro Timer Functionality
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Timer
    const timerText = document.querySelector('.timer-text');
    const sessionLabel = document.querySelector('.session-label');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const progressRing = document.querySelector('.progress-ring__circle');
    const pomodoroCountElement = document.getElementById('pomodoro-completed');
    const focusTimeElement = document.getElementById('focus-time');
    
    // DOM Elements - Settings
    const workDurationInput = document.getElementById('work-duration');
    const shortBreakDurationInput = document.getElementById('short-break-duration');
    const longBreakDurationInput = document.getElementById('long-break-duration');
    const pomodoroCycleInput = document.getElementById('pomodoro-cycle');
    const saveSettingsBtn = document.getElementById('save-settings');
    
    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Timer Variables
    let timer;
    let isRunning = false;
    let currentSession = 'work'; // 'work', 'shortBreak', 'longBreak'
    let secondsRemaining = 0;
    let totalSeconds = 0;
    let pomodoroCount = 0;
    let totalFocusSeconds = 0;
    let currentCycle = 1;
    
    // Settings (default values)
    let settings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        pomodoroCycle: 4
    };
    
    // Initialize date in footer
    document.getElementById('current-date').textContent = new Date().toLocaleDateString();
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
            
            // Update input fields
            workDurationInput.value = settings.workDuration;
            shortBreakDurationInput.value = settings.shortBreakDuration;
            longBreakDurationInput.value = settings.longBreakDuration;
            pomodoroCycleInput.value = settings.pomodoroCycle;
        }
        
        // Load stats
        const savedStats = localStorage.getItem('pomodoroStats');
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            const today = new Date().toLocaleDateString();
            
            if (stats.date === today) {
                pomodoroCount = stats.pomodoroCount || 0;
                totalFocusSeconds = stats.totalFocusSeconds || 0;
                updateStats();
            } else {
                // Reset stats for new day
                resetStats();
            }
        }
        
        resetTimer();
    }
    
    // Save settings to localStorage
    function saveSettings() {
        settings = {
            workDuration: parseInt(workDurationInput.value) || 25,
            shortBreakDuration: parseInt(shortBreakDurationInput.value) || 5,
            longBreakDuration: parseInt(longBreakDurationInput.value) || 15,
            pomodoroCycle: parseInt(pomodoroCycleInput.value) || 4
        };
        
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
        resetTimer();
    }
    
    // Reset timer to current session
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        
        // Set time based on current session
        switch (currentSession) {
            case 'work':
                totalSeconds = settings.workDuration * 60;
                sessionLabel.textContent = 'Work';
                break;
            case 'shortBreak':
                totalSeconds = settings.shortBreakDuration * 60;
                sessionLabel.textContent = 'Short Break';
                break;
            case 'longBreak':
                totalSeconds = settings.longBreakDuration * 60;
                sessionLabel.textContent = 'Long Break';
                break;
        }
        
        secondsRemaining = totalSeconds;
        updateTimerDisplay();
        updateProgressRing();
        
        // Update button states
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
    
    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Update progress ring
    function updateProgressRing() {
        const circumference = 2 * Math.PI * 120; // 2πr where r=120
        const offset = circumference * (1 - secondsRemaining / totalSeconds);
        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = offset;
    }
    
    // Start timer
    function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        timer = setInterval(() => {
            secondsRemaining--;
            
            // Update timer display and progress
            updateTimerDisplay();
            updateProgressRing();
            
            // Track focus time if in work session
            if (currentSession === 'work') {
                totalFocusSeconds++;
                saveStats();
            }
            
            // Timer completed
            if (secondsRemaining <= 0) {
                clearInterval(timer);
                playNotificationSound();
                
                // Handle session completion
                if (currentSession === 'work') {
                    pomodoroCount++;
                    updateStats();
                    
                    // Determine next break type
                    if (currentCycle % settings.pomodoroCycle === 0) {
                        currentSession = 'longBreak';
                    } else {
                        currentSession = 'shortBreak';
                    }
                    
                    currentCycle++;
                } else {
                    // After break, go back to work
                    currentSession = 'work';
                }
                
                // Reset timer for next session
                resetTimer();
                
                // Auto-start next session
                startTimer();
            }
        }, 1000);
    }
    
    // Pause timer
    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
    
    // Update stats display
    function updateStats() {
        pomodoroCountElement.textContent = pomodoroCount;
        
        const hours = Math.floor(totalFocusSeconds / 3600);
        const minutes = Math.floor((totalFocusSeconds % 3600) / 60);
        focusTimeElement.textContent = `${hours}h ${minutes}m`;
        
        saveStats();
        
        // Emit event for other modules to listen to
        const event = new CustomEvent('pomodoroCompleted', {
            detail: {
                pomodoroCount: pomodoroCount,
                totalFocusSeconds: totalFocusSeconds,
                currentSession: currentSession
            }
        });
        document.dispatchEvent(event);
        
        // Update study progress if function exists
        if (window.updateStudyProgress) {
            window.updateStudyProgress(totalFocusSeconds);
        }
    }
    
    // Save stats to localStorage
    function saveStats() {
        const stats = {
            date: new Date().toLocaleDateString(),
            pomodoroCount: pomodoroCount,
            totalFocusSeconds: totalFocusSeconds
        };
        
        localStorage.setItem('pomodoroStats', JSON.stringify(stats));
    }
    
    // Reset stats
    function resetStats() {
        pomodoroCount = 0;
        totalFocusSeconds = 0;
        updateStats();
    }
    
    // Play notification sound
    function playNotificationSound() {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play().catch(error => console.log('Error playing notification sound:', error));
    }
    
    // Toggle dark/light theme
    function toggleTheme() {
        const body = document.body;
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-mode');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Load saved theme
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.remove('dark-mode');
            themeIcon.className = 'fas fa-moon';
        } else {
            // Default to dark mode
            document.body.classList.add('dark-mode');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Event Listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', () => {
        currentSession = 'work';
        resetTimer();
    });
    saveSettingsBtn.addEventListener('click', saveSettings);
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Initialize
    loadSettings();
    loadTheme();
});
