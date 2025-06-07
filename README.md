# TickDone - Pomodoro Productivity App

A fully responsive, interactive Pomodoro + Daily Productivity Web App built with HTML, CSS, and JavaScript. Designed to enhance focus, productivity, and study sessions with multiple integrated tools.

## Features

### ⏱️ Pomodoro Timer
- Customizable Work / Short Break / Long Break durations
- Start, Pause, Reset buttons
- Automatically switch between sessions
- Animated SVG circular progress bar
- Visual count of completed pomodoros

### ✅ To-Do List for the Day
- Add tasks with title and optional time estimate
- Mark tasks as complete
- Edit or delete tasks
- Sort by completed/incomplete
- Store to-do list in localStorage so it persists

### 📄 Downloadable PDF Progress Sheet
- Generate a PDF report at the end of the day
- Include:
  - Total Pomodoros completed
  - Total time focused (in hours/minutes)
  - List of completed tasks
  - Timestamp of report generation
  - Motivational quote

### 🎵 Study Music Player
- Built-in music player with preset audio streams
- Categories include Lo-Fi, Classical, Nature Sounds, White Noise, Calm, and Ambient music
- Auto-play functionality when selecting music type
- Volume control and play/pause buttons
- Custom URL support for your favorite audio streams
- Fallback system that automatically tries alternative sources if one fails
- Dedicated music links page for easy access to working audio streams

### 📝 Enhanced Study Notes
- Subject-based organization with custom subject support
- Rich text formatting toolbar (bold, italic, underline, alignment, etc.)
- Auto-save functionality to prevent losing work
- Subject tabs for quick navigation between different topics
- Individual note download as formatted HTML files
- Persistent storage using localStorage

### 🎨 UI/UX Design
- Modern, minimalist layout
- Dark/Light mode toggle
- Responsive design (mobile and desktop)
- Smooth transitions/animations

## How to Use

1. **Open the app**: Simply open the `index.html` file in your web browser.

2. **Pomodoro Timer**:
   - Set your preferred durations for work and break sessions
   - Click "Start" to begin the timer
   - The timer will automatically switch between work and break sessions
   - You can pause or reset the timer at any time

3. **To-Do List**:
   - Add tasks by typing in the input field and clicking "Add Task"
   - Optionally add time estimates for each task
   - Mark tasks as complete by checking the checkbox
   - Edit or delete tasks using the respective buttons
   - Filter tasks by All, Active, or Completed
   - Generate a PDF report of your daily tasks and statistics

4. **Study Music Player**:
   - Select a music type from the dropdown to automatically play
   - Adjust volume using the slider
   - Pause/play using the control buttons
   - Enter a custom URL if you have a preferred audio stream
   - Access the "View All Music Links" page for easy copying of reliable audio streams

5. **Study Notes**:
   - Select a subject from the dropdown or add a new one
   - Use the formatting toolbar to style your notes
   - Notes are automatically saved as you type
   - Switch between subjects using the tabs at the top
   - Download individual notes as HTML files for backup or sharing

6. **Generate Report**:
   - Click the "Generate Report" button to create a PDF summary of your day
   - The report will include your completed pomodoros, focus time, and completed tasks

5. **Theme Toggle**:
   - Switch between light and dark mode by clicking the moon/sun icon in the header

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- Uses localStorage to persist data
- Uses jsPDF library for PDF generation
- No backend required - all frontend only
- Responsive design works on mobile and desktop

## Credits

- Font Awesome for icons
- jsPDF for PDF generation
- Mixkit for notification sounds

Enjoy your productive day!
