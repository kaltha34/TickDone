// Study Enhancement Features
document.addEventListener('DOMContentLoaded', () => {
    // Toast notification function
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Show the toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide and remove the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    // Music Player Elements
    const musicSelect = document.getElementById('music-select');
    const customUrlContainer = document.getElementById('custom-url-container');
    const customMusicUrl = document.getElementById('custom-music-url');
    const applyCustomUrl = document.getElementById('apply-custom-url');
    const playMusicBtn = document.getElementById('play-music');
    const pauseMusicBtn = document.getElementById('pause-music');
    const volumeControl = document.getElementById('volume-control');
    
    // Focus Quote Elements
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    
    // Study Notes Elements
    const studyNotes = document.getElementById('study-notes');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const clearNoteBtn = document.getElementById('clear-note-btn');
    
    // Audio element for music player
    let audioPlayer = new Audio();
    audioPlayer.loop = true;
    audioPlayer.crossOrigin = "anonymous"; // Allow cross-origin requests
    
    // Add error handling for audio player
    audioPlayer.onerror = function(e) {
        console.error('Audio error:', e);
        showToast('Error playing audio. Trying alternative source...');
        tryAlternativeSource();
    };
    
    // Fallback audio streams that are more likely to work in browsers
    const fallbackStreams = {
        "lofi": [
            "https://streams.ilovemusic.de/iloveradio17.mp3",
            "https://stream.laut.fm/lofi",
            "https://play.streamafrica.net/lofiradio"
        ],
        "classical": [
            "https://live.musopen.org:8085/streamvbr0",
            "https://stream.0nlineradio.com/classical",
            "https://strm112.1.fm/classical_mobile_mp3"
        ],
        "nature": [
            "https://mp3.chillhop.com/serve.php/?mp3=10075",
            "https://stream.laut.fm/nature",
            "https://streams.calmradio.com/api/36/128/stream"
        ],
        "whitenoise": [
            "https://whitenoise.laut.fm/whitenoise",
            "https://icecast.radiofrance.fr/fip-lofi-midfi.aac",
            "https://ais-sa2.cdnstream1.com/2606_128.mp3",
            "https://streams.ilovemusic.de/iloveradio20.mp3",
            "https://stream.laut.fm/whitenoise"
        ],
        "calm": [
            "https://strm112.1.fm/relaxation_mobile_mp3",
            "https://stream.laut.fm/relaxing",
            "https://streams.calmradio.com/api/151/128/stream"
        ],
        "ambient": [
            "https://strm112.1.fm/ambient_mobile_mp3",
            "https://stream.laut.fm/ambient",
            "https://streams.calmradio.com/api/124/128/stream"
        ]
    };
    
    // Track current source attempts
    let currentSourceType = '';
    let currentSourceIndex = 0;
    
    // Try alternative audio sources when one fails
    function tryAlternativeSource() {
        if (!currentSourceType || !fallbackStreams[currentSourceType]) {
            // If no valid source type, can't try alternatives
            return;
        }
        
        const sources = fallbackStreams[currentSourceType];
        currentSourceIndex++;
        
        if (currentSourceIndex < sources.length) {
            // Try next source in the array
            audioPlayer.src = sources[currentSourceIndex];
            showToast(`Trying alternative source ${currentSourceIndex + 1}/${sources.length}`);
            
            // Try to play with the new source
            audioPlayer.play().catch(error => {
                console.error('Error with alternative source:', error);
                // Try next source if this one fails
                tryAlternativeSource();
            });
        } else {
            // All sources tried and failed
            showToast('Unable to play audio. Please try a different music type.');
            disablePlayerControls();
        }
    }
    
    // Collection of motivational quotes
    const quotes = [
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
        { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "Your focus determines your reality.", author: "George Lucas" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
        { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
        { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
        { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
        { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
        { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" }
    ];
    
    // Initialize Music Player
    function initMusicPlayer() {
        // Hide custom URL container initially
        customUrlContainer.classList.add('hidden');
        
        // Show/hide custom URL input based on selection and auto-play music
        musicSelect.addEventListener('change', () => {
            if (musicSelect.value === 'custom') {
                customUrlContainer.classList.remove('hidden');
                currentSourceType = '';
            } else if (musicSelect.value) {
                customUrlContainer.classList.add('hidden');
                
                // Reset source tracking
                currentSourceType = musicSelect.value;
                currentSourceIndex = 0;
                
                // Use fallback streams if available
                if (fallbackStreams[musicSelect.value] && fallbackStreams[musicSelect.value].length > 0) {
                    audioPlayer.src = fallbackStreams[musicSelect.value][0];
                    showToast(`Loading ${musicSelect.options[musicSelect.selectedIndex].text}...`);
                    
                    // Auto-play when source is selected
                    playMusicBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    
                    // Small delay to ensure the audio source is loaded
                    setTimeout(() => {
                        audioPlayer.play().then(() => {
                            // Success - update UI
                            playMusicBtn.innerHTML = '<i class="fas fa-play"></i>';
                            playMusicBtn.disabled = true;
                            pauseMusicBtn.disabled = false;
                            showToast(`${musicSelect.options[musicSelect.selectedIndex].text} playing`);
                        }).catch(error => {
                            console.error('Error playing audio:', error);
                            playMusicBtn.innerHTML = '<i class="fas fa-play"></i>';
                            
                            // If we have fallback sources for the current type, try them
                            if (currentSourceType && fallbackStreams[currentSourceType]) {
                                tryAlternativeSource();
                            } else {
                                showToast('Unable to play audio. Please check the URL and try again.');
                            }
                        });
                    }, 300);
                } else {
                    audioPlayer.src = musicSelect.value;
                }
                
                enablePlayerControls();
            } else {
                customUrlContainer.classList.add('hidden');
                disablePlayerControls();
                currentSourceType = '';
            }
        });
        
        // Apply custom URL and auto-play
        applyCustomUrl.addEventListener('click', () => {
            const customUrl = customMusicUrl.value.trim();
            if (customUrl) {
                // Reset source tracking for custom URL
                currentSourceType = '';
                currentSourceIndex = 0;
                
                audioPlayer.src = customUrl;
                showToast('Custom audio source loaded');
                enablePlayerControls();
                
                // Auto-play the custom URL
                playMusicBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                
                // Small delay to ensure the audio source is loaded
                setTimeout(() => {
                    audioPlayer.play().then(() => {
                        // Success - update UI
                        playMusicBtn.innerHTML = '<i class="fas fa-play"></i>';
                        playMusicBtn.disabled = true;
                        pauseMusicBtn.disabled = false;
                        showToast('Custom music playing');
                    }).catch(error => {
                        console.error('Error playing custom audio:', error);
                        playMusicBtn.innerHTML = '<i class="fas fa-play"></i>';
                        showToast('Unable to play this URL. Please check the URL and try again.');
                    });
                }, 300);
            } else {
                showToast('Please enter a valid URL');
            }
        });
        
        // Play music
        playMusicBtn.addEventListener('click', () => {
            // Show loading indicator
            playMusicBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            audioPlayer.play().then(() => {
                // Success - update UI
                playMusicBtn.innerHTML = '<i class="fas fa-play"></i>';
                playMusicBtn.disabled = true;
                pauseMusicBtn.disabled = false;
                showToast('Music playing');
            }).catch(error => {
                console.error('Error playing audio:', error);
                playMusicBtn.innerHTML = '<i class="fas fa-play"></i>';
                
                // If we have fallback sources for the current type, try them
                if (currentSourceType && fallbackStreams[currentSourceType]) {
                    tryAlternativeSource();
                } else {
                    showToast('Unable to play audio. Please check the URL and try again.');
                }
            });
        });
        
        // Pause music
        pauseMusicBtn.addEventListener('click', () => {
            audioPlayer.pause();
            playMusicBtn.disabled = false;
            pauseMusicBtn.disabled = true;
            showToast('Music paused');
        });
        
        // Volume control
        volumeControl.addEventListener('input', () => {
            audioPlayer.volume = volumeControl.value / 100;
        });
        
        // Set initial volume
        audioPlayer.volume = volumeControl.value / 100;
        
        // Save music preferences to localStorage
        function saveMusicPreferences() {
            const preferences = {
                volume: volumeControl.value,
                isCustom: musicSelect.value === 'custom',
                sourceType: currentSourceType || musicSelect.value
            };
            
            // Save source URL for custom streams
            if (preferences.isCustom) {
                preferences.source = audioPlayer.src || customMusicUrl.value || '';
            }
            
            localStorage.setItem('musicPreferences', JSON.stringify(preferences));
        }
        
        // Load music preferences from localStorage
        function loadMusicPreferences() {
            const savedPreferences = localStorage.getItem('musicPreferences');
            if (savedPreferences) {
                try {
                    const preferences = JSON.parse(savedPreferences);
                    
                    // Set volume first
                    if (preferences.volume) {
                        volumeControl.value = preferences.volume;
                        audioPlayer.volume = preferences.volume / 100;
                    }
                    
                    if (preferences.isCustom && preferences.source) {
                        // Custom URL
                        musicSelect.value = 'custom';
                        customUrlContainer.classList.remove('hidden');
                        customMusicUrl.value = preferences.source;
                        currentSourceType = '';
                        
                        if (preferences.source) {
                            audioPlayer.src = preferences.source;
                            enablePlayerControls();
                        }
                    } else if (preferences.sourceType && fallbackStreams[preferences.sourceType]) {
                        // Preset stream
                        musicSelect.value = preferences.sourceType;
                        customUrlContainer.classList.add('hidden');
                        currentSourceType = preferences.sourceType;
                        currentSourceIndex = 0;
                        
                        // Use the first source in the array
                        audioPlayer.src = fallbackStreams[preferences.sourceType][0];
                        enablePlayerControls();
                    }
                } catch (e) {
                    console.error('Error loading music preferences:', e);
                    // Handle legacy format if needed
                }
            }
        }
        
        // Enable player controls
        function enablePlayerControls() {
            playMusicBtn.disabled = false;
            pauseMusicBtn.disabled = true;
            volumeControl.disabled = false;
        }
        
        // Disable player controls
        function disablePlayerControls() {
            playMusicBtn.disabled = true;
            pauseMusicBtn.disabled = true;
            audioPlayer.pause();
            playMusicBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        
        // Save preferences when changes are made
        musicSelect.addEventListener('change', saveMusicPreferences);
        applyCustomUrl.addEventListener('click', saveMusicPreferences);
        volumeControl.addEventListener('change', saveMusicPreferences);
        
        // Load saved preferences
        loadMusicPreferences();
    }
    
    // Initialize Focus Quotes
    function initFocusQuotes() {
        // Display a random quote
        function displayRandomQuote() {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const quote = quotes[randomIndex];
            
            quoteText.textContent = `"${quote.text}"`;
            quoteAuthor.textContent = `- ${quote.author}`;
        }
        
        // Event listener for new quote button
        newQuoteBtn.addEventListener('click', displayRandomQuote);
        
        // Display initial random quote
        displayRandomQuote();
    }
    
    // Initialize Study Notes
    function initStudyNotes() {
        // Get all required elements
        const studyNotes = document.getElementById('study-notes');
        const saveNoteBtn = document.getElementById('save-note-btn');
        const clearNoteBtn = document.getElementById('clear-note-btn');
        const downloadNoteBtn = document.getElementById('download-note-btn');
        const subjectSelect = document.getElementById('subject-select');
        const customSubject = document.getElementById('custom-subject');
        const addSubjectBtn = document.getElementById('add-subject-btn');
        const notesList = document.getElementById('notes-list');
        const headingSelect = document.getElementById('heading-select');
        const formatButtons = document.querySelectorAll('.format-btn');
        
        // Track current subject and all notes
        let currentSubject = '';
        let allNotes = {};
        
        // Load saved notes
        const loadNotes = () => {
            const savedNotes = localStorage.getItem('studyNotes');
            if (savedNotes) {
                try {
                    allNotes = JSON.parse(savedNotes);
                    // Create tabs for each subject
                    renderSubjectTabs();
                    
                    // If there are subjects, select the first one
                    const subjects = Object.keys(allNotes);
                    if (subjects.length > 0) {
                        selectSubject(subjects[0]);
                    }
                } catch (e) {
                    console.error('Error parsing saved notes:', e);
                    // Handle legacy format (plain text)
                    if (typeof savedNotes === 'string') {
                        allNotes = { 'General': savedNotes };
                        renderSubjectTabs();
                        selectSubject('General');
                    }
                }
            } else {
                allNotes = {};
            }
        };
        
        // Render subject tabs
        const renderSubjectTabs = () => {
            notesList.innerHTML = '';
            
            Object.keys(allNotes).forEach(subject => {
                const tab = document.createElement('div');
                tab.className = 'subject-tab';
                if (subject === currentSubject) {
                    tab.classList.add('active');
                }
                tab.textContent = subject;
                tab.addEventListener('click', () => selectSubject(subject));
                
                notesList.appendChild(tab);
            });
        };
        
        // Select a subject and load its notes
        const selectSubject = (subject) => {
            currentSubject = subject;
            
            // Update active tab
            document.querySelectorAll('.subject-tab').forEach(tab => {
                tab.classList.toggle('active', tab.textContent === subject);
            });
            
            // Load content
            if (allNotes[subject]) {
                studyNotes.innerHTML = allNotes[subject];
            } else {
                studyNotes.innerHTML = '';
            }
        };
        
        // Add new subject
        const addNewSubject = () => {
            let newSubject;
            
            if (subjectSelect.value === 'other') {
                newSubject = customSubject.value.trim();
                if (!newSubject) {
                    alert('Please enter a subject name');
                    return;
                }
            } else if (subjectSelect.value) {
                newSubject = subjectSelect.options[subjectSelect.selectedIndex].text;
            } else {
                alert('Please select a subject');
                return;
            }
            
            // Check if subject already exists
            if (allNotes[newSubject]) {
                selectSubject(newSubject);
                return;
            }
            
            // Add new subject
            allNotes[newSubject] = '';
            saveNotes();
            renderSubjectTabs();
            selectSubject(newSubject);
            
            // Reset inputs
            subjectSelect.value = '';
            customSubject.value = '';
            customSubject.classList.add('hidden');
        };
        
        // Save notes
        const saveNotes = () => {
            if (currentSubject) {
                allNotes[currentSubject] = studyNotes.innerHTML;
            }
            localStorage.setItem('studyNotes', JSON.stringify(allNotes));
            showToast('Notes saved successfully!');
        };
        
        // Clear notes
        const clearNotes = () => {
            if (currentSubject) {
                if (confirm(`Are you sure you want to clear notes for ${currentSubject}?`)) {
                    allNotes[currentSubject] = '';
                    studyNotes.innerHTML = '';
                    saveNotes();
                    showToast(`Notes for ${currentSubject} cleared!`);
                }
            } else {
                alert('Please select a subject first');
            }
        };
        
        // Download current note as HTML
        const downloadCurrentNote = () => {
            if (!currentSubject || !allNotes[currentSubject]) {
                alert('No notes to download');
                return;
            }
            
            // Create HTML content
            const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${currentSubject} Notes</title>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1 { color: #4361ee; }
                    h2 { color: #3a0ca3; }
                    h3 { color: #4895ef; }
                    .note-content { margin-top: 20px; }
                </style>
            </head>
            <body>
                <h1>${currentSubject} Notes</h1>
                <div class="note-content">${allNotes[currentSubject]}</div>
                <p><small>Generated on ${new Date().toLocaleString()}</small></p>
            </body>
            </html>
            `;
            
            // Create download link
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentSubject.replace(/\s+/g, '-').toLowerCase()}-notes.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
        
        // Format text
        const formatText = (command, value = null) => {
            document.execCommand(command, false, value);
            studyNotes.focus();
        };
        
        // Event Listeners
        
        // Show/hide custom subject input
        subjectSelect.addEventListener('change', () => {
            if (subjectSelect.value === 'other') {
                customSubject.classList.remove('hidden');
                customSubject.focus();
            } else {
                customSubject.classList.add('hidden');
            }
        });
        
        // Add new subject
        addSubjectBtn.addEventListener('click', addNewSubject);
        
        // Format buttons
        formatButtons.forEach(button => {
            button.addEventListener('click', () => {
                formatText(button.dataset.command);
                button.classList.toggle('active');
            });
        });
        
        // Heading select
        headingSelect.addEventListener('change', () => {
            if (headingSelect.value) {
                formatText('formatBlock', `<${headingSelect.value}>`);
            } else {
                formatText('formatBlock', '<p>');
            }
            headingSelect.value = '';
        });
        
        // Event listeners for buttons
        saveNoteBtn.addEventListener('click', saveNotes);
        clearNoteBtn.addEventListener('click', clearNotes);
        downloadNoteBtn.addEventListener('click', downloadCurrentNote);
        
        // Auto-save notes every minute
        setInterval(() => {
            if (currentSubject && studyNotes.innerHTML) {
                allNotes[currentSubject] = studyNotes.innerHTML;
                localStorage.setItem('studyNotes', JSON.stringify(allNotes));
                console.log(`Auto-saved notes for ${currentSubject}`);
            }
        }, 60000); // 60000 ms = 1 minute
        
        // Initialize notes
        loadNotes();
    }
    
    // Initialize all study enhancement features
    initMusicPlayer();
    initFocusQuotes();
    initStudyNotes();
});
