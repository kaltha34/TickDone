// Student Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update current date
    const dateDisplay = document.getElementById('current-date');
    const greetingElement = document.getElementById('student-greeting');
    
    function updateDateTime() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = now.toLocaleDateString(undefined, options);
        
        // Update greeting based on time of day
        const hour = now.getHours();
        let greeting = '';
        
        if (hour < 12) {
            greeting = 'Good morning, Student!';
        } else if (hour < 18) {
            greeting = 'Good afternoon, Student!';
        } else {
            greeting = 'Good evening, Student!';
        }
        
        greetingElement.textContent = greeting;
    }
    
    // Update immediately and then every minute
    updateDateTime();
    setInterval(updateDateTime, 60000);
    
    // Allow user to set their name
    greetingElement.addEventListener('click', function() {
        const userName = localStorage.getItem('userName') || 'Student';
        const newName = prompt('Enter your name:', userName);
        
        if (newName && newName.trim() !== '') {
            localStorage.setItem('userName', newName.trim());
            updateGreetingWithName();
        }
    });
    
    function updateGreetingWithName() {
        const userName = localStorage.getItem('userName');
        if (userName) {
            const hour = new Date().getHours();
            let greeting = '';
            
            if (hour < 12) {
                greeting = `Good morning, ${userName}!`;
            } else if (hour < 18) {
                greeting = `Good afternoon, ${userName}!`;
            } else {
                greeting = `Good evening, ${userName}!`;
            }
            
            greetingElement.textContent = greeting;
        }
    }
    
    // Check if user name exists and update greeting
    updateGreetingWithName();
});
