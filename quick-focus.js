// Quick Focus Mode functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const quickFocusBtn = document.getElementById('quick-focus-btn');
    const quickFocusModal = document.getElementById('quick-focus-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const quickOptions = document.querySelectorAll('.quick-option');
    const customMinutesInput = document.getElementById('custom-minutes');
    const startCustomFocusBtn = document.getElementById('start-custom-focus');
    
    // Show modal when quick focus button is clicked
    quickFocusBtn.addEventListener('click', function() {
        quickFocusModal.classList.remove('hidden');
        setTimeout(() => {
            quickFocusModal.classList.add('show');
        }, 10);
    });
    
    // Hide modal when close button is clicked
    closeModalBtn.addEventListener('click', function() {
        closeModal();
    });
    
    // Hide modal when clicking outside the modal content
    quickFocusModal.addEventListener('click', function(e) {
        if (e.target === quickFocusModal) {
            closeModal();
        }
    });
    
    // Handle quick option buttons
    quickOptions.forEach(option => {
        option.addEventListener('click', function() {
            const minutes = parseInt(this.getAttribute('data-minutes'));
            startQuickFocus(minutes);
        });
    });
    
    // Handle custom duration button
    startCustomFocusBtn.addEventListener('click', function() {
        const minutes = parseInt(customMinutesInput.value);
        if (minutes > 0 && minutes <= 120) {
            startQuickFocus(minutes);
        } else {
            showToast('Please enter a valid duration between 1 and 120 minutes');
        }
    });
    
    // Function to close the modal
    function closeModal() {
        quickFocusModal.classList.remove('show');
        setTimeout(() => {
            quickFocusModal.classList.add('hidden');
        }, 300);
    }
    
    // Function to start a quick focus session
    function startQuickFocus(minutes) {
        // Set the work duration in settings
        const settings = JSON.parse(localStorage.getItem('pomodoroSettings')) || {
            workDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            pomodoroCycle: 4
        };
        
        // Save the original settings to restore later
        localStorage.setItem('originalSettings', JSON.stringify(settings));
        
        // Update settings for quick focus
        settings.workDuration = minutes;
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
        
        // Close the modal
        closeModal();
        
        // Show toast notification
        showToast(`Starting ${minutes}-minute focus session`);
        
        // Reload settings and start timer (these functions should be available in the global scope)
        if (window.loadSettings) {
            window.loadSettings();
            
            // Reset and start the timer
            if (window.resetTimer && window.startTimer) {
                setTimeout(() => {
                    window.resetTimer();
                    window.startTimer();
                }, 500);
            }
        } else {
            // If the functions aren't available, reload the page
            location.reload();
        }
    }
    
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
});
