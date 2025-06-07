// Study Progress Tracker functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const focusMinutesElement = document.getElementById('focus-minutes');
    const completionPercentageElement = document.getElementById('completion-percentage');
    const streakCountElement = document.getElementById('streak-count');
    const progressBarElement = document.getElementById('daily-progress-bar');
    const dailyGoalInput = document.getElementById('daily-goal');
    const setGoalBtn = document.getElementById('set-goal-btn');
    
    // Load saved values from localStorage
    let dailyGoal = parseInt(localStorage.getItem('dailyGoal')) || 120; // Default 2 hours
    let focusMinutes = parseInt(localStorage.getItem('focusMinutes')) || 0;
    let lastActiveDate = localStorage.getItem('lastActiveDate');
    let streakCount = parseInt(localStorage.getItem('streakCount')) || 0;
    
    // Initialize UI
    dailyGoalInput.value = dailyGoal;
    updateProgressDisplay();
    
    // Set goal button click handler
    setGoalBtn.addEventListener('click', function() {
        const newGoal = parseInt(dailyGoalInput.value);
        if (newGoal > 0 && newGoal <= 480) { // Max 8 hours
            dailyGoal = newGoal;
            localStorage.setItem('dailyGoal', dailyGoal);
            updateProgressDisplay();
            showToast(`Daily goal set to ${dailyGoal} minutes`);
        } else {
            showToast('Please enter a valid goal between 1 and 480 minutes');
        }
    });
    
    // Update progress when pomodoro timer completes
    function updateProgress(focusTimeSeconds) {
        // Convert seconds to minutes
        focusMinutes = Math.floor(focusTimeSeconds / 60);
        localStorage.setItem('focusMinutes', focusMinutes);
        
        // Check streak
        const today = new Date().toLocaleDateString();
        if (lastActiveDate !== today) {
            if (isYesterday(lastActiveDate)) {
                // Increment streak if yesterday was the last active day
                streakCount++;
            } else if (lastActiveDate) {
                // Reset streak if there was a gap
                streakCount = 1;
            } else {
                // First time using the app
                streakCount = 1;
            }
            localStorage.setItem('streakCount', streakCount);
            localStorage.setItem('lastActiveDate', today);
        }
        
        updateProgressDisplay();
    }
    
    // Helper function to check if a date string is yesterday
    function isYesterday(dateString) {
        if (!dateString) return false;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toLocaleDateString() === dateString;
    }
    
    // Update the UI elements
    function updateProgressDisplay() {
        focusMinutesElement.textContent = focusMinutes;
        
        const percentage = Math.min(Math.round((focusMinutes / dailyGoal) * 100), 100);
        completionPercentageElement.textContent = `${percentage}%`;
        progressBarElement.style.width = `${percentage}%`;
        
        // Change progress bar color based on percentage
        if (percentage < 30) {
            progressBarElement.style.backgroundColor = '#ff9800'; // Orange
        } else if (percentage < 100) {
            progressBarElement.style.backgroundColor = '#4caf50'; // Green
        } else {
            progressBarElement.style.backgroundColor = '#8e44ad'; // Purple for achievement
        }
        
        streakCountElement.textContent = streakCount;
    }
    
    // Listen for pomodoro completion events
    document.addEventListener('pomodoroCompleted', function(e) {
        updateProgress(e.detail.totalFocusSeconds);
    });
    
    // Show toast function (reusing from other modules if available)
    function showToast(message) {
        if (window.showToast) {
            window.showToast(message);
        } else {
            // Fallback toast implementation
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('show');
                
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(toast);
                    }, 300);
                }, 3000);
            }, 100);
        }
    }
    
    // Expose update function to global scope for other modules to call
    window.updateStudyProgress = updateProgress;
});
