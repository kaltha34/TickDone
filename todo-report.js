// Todo List and Report Generation Functionality
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Todo List
    const taskInput = document.getElementById('task-input');
    const timeEstimateInput = document.getElementById('time-estimate');
    const taskPrioritySelect = document.getElementById('task-priority');
    const taskCategorySelect = document.getElementById('task-category');
    const addTaskBtn = document.getElementById('add-task-btn');
    const todoList = document.getElementById('todo-list');
    const filterAllBtn = document.getElementById('filter-all');
    const filterActiveBtn = document.getElementById('filter-active');
    const filterCompletedBtn = document.getElementById('filter-completed');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');
    const generateReportBtn = document.getElementById('generate-report-btn');
    const filterCategorySelect = document.getElementById('filter-category');
    const filterPrioritySelect = document.getElementById('filter-priority');
    
    // Todo List Variables
    let todos = [];
    let currentFilter = 'all';
    let currentCategoryFilter = 'all';
    let currentPriorityFilter = 'all';
    
    // Load todos from localStorage
    function loadTodos() {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            todos = JSON.parse(savedTodos);
            renderTodos();
        }
    }
    
    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    // Render todos
    function renderTodos() {
        todoList.innerHTML = '';
        
        // Filter todos based on current filter, category, and priority
        let filteredTodos = [];
        
        // First filter by completion status
        if (currentFilter === 'all') {
            filteredTodos = [...todos];
        } else if (currentFilter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }
        
        // Then filter by category if not 'all'
        if (currentCategoryFilter !== 'all') {
            filteredTodos = filteredTodos.filter(todo => todo.category === currentCategoryFilter);
        }
        
        // Then filter by priority if not 'all'
        if (currentPriorityFilter !== 'all') {
            filteredTodos = filteredTodos.filter(todo => todo.priority === currentPriorityFilter);
        }
        
        // Render filtered todos
        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'todo-completed' : ''} ${todo.priority ? 'priority-' + todo.priority : ''}`;
            todoItem.dataset.id = todo.id;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo-checkbox';
            checkbox.checked = todo.completed;
            
            const todoContent = document.createElement('div');
            todoContent.className = 'todo-content';
            
            const todoTitle = document.createElement('div');
            todoTitle.className = 'todo-title';
            todoTitle.textContent = todo.title;
            
            // Add category badge if available
            if (todo.category) {
                const categoryBadge = document.createElement('span');
                categoryBadge.className = `category-badge category-${todo.category}`;
                categoryBadge.textContent = todo.category.charAt(0).toUpperCase() + todo.category.slice(1);
                todoTitle.appendChild(categoryBadge);
            }
            
            const todoDetails = document.createElement('div');
            todoDetails.className = 'todo-details';
            
            // Add time estimate
            if (todo.timeEstimate) {
                const todoEstimate = document.createElement('span');
                todoEstimate.className = 'todo-estimate';
                todoEstimate.innerHTML = `<i class="fas fa-clock"></i> ${todo.timeEstimate} min`;
                todoDetails.appendChild(todoEstimate);
            }
            
            // Add priority indicator
            if (todo.priority) {
                const todoPriority = document.createElement('span');
                todoPriority.className = `todo-priority priority-${todo.priority}-text`;
                const priorityIcons = {
                    'high': '<i class="fas fa-exclamation-circle"></i> High',
                    'medium': '<i class="fas fa-dot-circle"></i> Medium',
                    'low': '<i class="fas fa-arrow-down"></i> Low'
                };
                todoPriority.innerHTML = priorityIcons[todo.priority] || '';
                todoDetails.appendChild(todoPriority);
            }
            
            const todoActions = document.createElement('div');
            todoActions.className = 'todo-actions';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'todo-edit-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'todo-delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            
            // Append elements
            todoContent.appendChild(todoTitle);
            todoContent.appendChild(todoDetails);
            
            todoActions.appendChild(editBtn);
            todoActions.appendChild(deleteBtn);
            
            todoItem.appendChild(checkbox);
            todoItem.appendChild(todoContent);
            todoItem.appendChild(todoActions);
            
            todoList.appendChild(todoItem);
            
            // Add event listeners
            checkbox.addEventListener('change', () => toggleTodoComplete(todo.id));
            editBtn.addEventListener('click', () => editTodo(todo.id));
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        });
    }
    
    // Add new todo
    function addTodo() {
        const title = taskInput.value.trim();
        const timeEstimate = parseInt(timeEstimateInput.value) || null;
        const priority = taskPrioritySelect.value;
        const category = taskCategorySelect.value;
        
        if (title === '') return;
        
        const newTodo = {
            id: Date.now().toString(),
            title,
            timeEstimate,
            priority,
            category,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        todos.push(newTodo);
        saveTodos();
        renderTodos();
        
        // Clear inputs
        taskInput.value = '';
        timeEstimateInput.value = '';
        // Reset priority to medium and keep the category as is
        taskPrioritySelect.value = 'medium';
        taskInput.focus();
    }
    
    // Toggle todo complete status
    function toggleTodoComplete(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        
        saveTodos();
        renderTodos();
    }
    
    // Edit todo
    function editTodo(id) {
        const todo = todos.find(todo => todo.id === id);
        if (!todo) return;
        
        // Create a modal for editing instead of using prompts
        const editModal = document.createElement('div');
        editModal.className = 'modal';
        editModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Edit Task</h3>
                <div class="edit-form">
                    <div class="form-group">
                        <label for="edit-title">Task Title:</label>
                        <input type="text" id="edit-title" value="${todo.title}">
                    </div>
                    <div class="form-group">
                        <label for="edit-time">Time Estimate (minutes):</label>
                        <input type="number" id="edit-time" value="${todo.timeEstimate || ''}" min="1">
                    </div>
                    <div class="form-group">
                        <label for="edit-priority">Priority:</label>
                        <select id="edit-priority">
                            <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-category">Category:</label>
                        <select id="edit-category">
                            <option value="study" ${todo.category === 'study' ? 'selected' : ''}>Study</option>
                            <option value="assignment" ${todo.category === 'assignment' ? 'selected' : ''}>Assignment</option>
                            <option value="exam" ${todo.category === 'exam' ? 'selected' : ''}>Exam Prep</option>
                            <option value="project" ${todo.category === 'project' ? 'selected' : ''}>Project</option>
                            <option value="reading" ${todo.category === 'reading' ? 'selected' : ''}>Reading</option>
                            <option value="other" ${todo.category === 'other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button id="save-edit-btn">Save Changes</button>
                        <button id="cancel-edit-btn">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(editModal);
        
        // Show the modal
        setTimeout(() => {
            editModal.classList.add('show');
        }, 10);
        
        // Get form elements
        const titleInput = document.getElementById('edit-title');
        const timeInput = document.getElementById('edit-time');
        const prioritySelect = document.getElementById('edit-priority');
        const categorySelect = document.getElementById('edit-category');
        const saveBtn = document.getElementById('save-edit-btn');
        const cancelBtn = document.getElementById('cancel-edit-btn');
        const closeBtn = editModal.querySelector('.close-modal');
        
        // Focus on title input
        titleInput.focus();
        
        // Close modal function
        const closeModal = () => {
            editModal.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(editModal);
            }, 300);
        };
        
        // Event listeners
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // Close when clicking outside
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                closeModal();
            }
        });
        
        // Save changes
        saveBtn.addEventListener('click', () => {
            const newTitle = titleInput.value.trim();
            if (!newTitle) {
                alert('Task title cannot be empty');
                return;
            }
            
            todos = todos.map(t => {
                if (t.id === id) {
                    return { 
                        ...t, 
                        title: newTitle,
                        timeEstimate: parseInt(timeInput.value) || null,
                        priority: prioritySelect.value,
                        category: categorySelect.value
                    };
                }
                return t;
            });
            
            saveTodos();
            renderTodos();
            closeModal();
        });
    }
    
    // Delete todo
    function deleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
        }
    }
    
    // Clear completed todos
    function clearCompleted() {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    }
    
    // Set active filter
    function setFilter(filter) {
        currentFilter = filter;
        
        // Update active filter button
        [filterAllBtn, filterActiveBtn, filterCompletedBtn].forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (filter === 'all') filterAllBtn.classList.add('active');
        if (filter === 'active') filterActiveBtn.classList.add('active');
        if (filter === 'completed') filterCompletedBtn.classList.add('active');
        
        renderTodos();
    }
    
    // Generate PDF Report
    function generateReport() {
        try {
            // Get stats
            const stats = JSON.parse(localStorage.getItem('pomodoroStats')) || {
                pomodoroCount: 0,
                totalFocusSeconds: 0
            };
            
            const completedTodos = todos.filter(todo => todo.completed);
            
            // Format time
            const hours = Math.floor(stats.totalFocusSeconds / 3600);
            const minutes = Math.floor((stats.totalFocusSeconds % 3600) / 60);
            const focusTimeFormatted = `${hours}h ${minutes}m`;
            
            // Get motivational quotes
            const quotes = [
                "The secret of getting ahead is getting started. - Mark Twain",
                "It always seems impossible until it's done. - Nelson Mandela",
                "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
                "The way to get started is to quit talking and begin doing. - Walt Disney",
                "You don't have to be great to start, but you have to start to be great. - Zig Ziglar"
            ];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            
            // Current date and time
            const now = new Date();
            const dateFormatted = now.toLocaleDateString();
            const timeFormatted = now.toLocaleTimeString();
            
            // Check if jsPDF is available
            if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
                console.error('jsPDF not found');
                alert('PDF generation library not loaded. Please refresh the page and try again.');
                return;
            }
            
            // Create PDF document
            let doc;
            if (typeof window.jspdf !== 'undefined') {
                const { jsPDF } = window.jspdf;
                doc = new jsPDF();
            } else {
                doc = new window.jsPDF();
            }
            
            // Add title
            doc.setFontSize(22);
            doc.setTextColor(66, 97, 238); // Accent color
            doc.text('Productivity Report', 105, 20, { align: 'center' });
            
            // Add date and time
            doc.setFontSize(12);
            doc.setTextColor(108, 117, 125); // Text secondary color
            doc.text(`Generated on ${dateFormatted} at ${timeFormatted}`, 105, 30, { align: 'center' });
            
            // Add stats
            doc.setFontSize(16);
            doc.setTextColor(33, 37, 41); // Text primary color
            doc.text('Daily Statistics', 20, 50);
            
            doc.setFontSize(14);
            doc.text(`Pomodoros Completed: ${stats.pomodoroCount}`, 30, 60);
            doc.text(`Total Focus Time: ${focusTimeFormatted}`, 30, 70);
            
            // Add completed tasks section
            doc.setFontSize(16);
            doc.text('Completed Tasks', 20, 90);
            
            // Create table with priority and category
            const tableColumn = ['Task', 'Category', 'Priority', 'Time Est. (min)', 'Completed At'];
            const tableRows = [];
            
            // Priority display mapping
            const priorityMap = {
                'high': 'High ⚠️',
                'medium': 'Medium ●',
                'low': 'Low ↓'
            };
            
            // Category display mapping
            const categoryMap = {
                'study': 'Study 📚',
                'assignment': 'Assignment 📝',
                'exam': 'Exam Prep 📋',
                'project': 'Project 🚀',
                'reading': 'Reading 📖',
                'other': 'Other 📌'
            };
            
            completedTodos.forEach(todo => {
                const completedDate = new Date(todo.completedAt || todo.createdAt);
                const row = [
                    todo.title,
                    categoryMap[todo.category] || 'N/A',
                    priorityMap[todo.priority] || 'N/A',
                    todo.timeEstimate || '-',
                    completedDate.toLocaleString()
                ];
                tableRows.push(row);
            });
            
            // Add table to PDF
            doc.autoTable({
                startY: 95,
                head: [tableColumn],
                body: tableRows,
                theme: 'grid',
                headStyles: {
                    fillColor: [66, 97, 238],
                    textColor: 255
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240]
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                    1: { cellWidth: 30 },
                    2: { cellWidth: 25 },
                    3: { cellWidth: 25 },
                    4: { cellWidth: 40 }
                }
            });
            
            // Add quote at the bottom
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 120;
            
            doc.setFontSize(12);
            doc.setTextColor(108, 117, 125);
            doc.text('Today\'s Inspiration:', 20, finalY);
            doc.setFont(undefined, 'italic');
            doc.text(`"${randomQuote}"`, 20, finalY + 10);
            
            // Save PDF
            doc.save(`productivity-report-${dateFormatted.replace(/\//g, '-')}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Could not generate PDF report. Please try again.');
        }
    }
    
    // Event Listeners
    addTaskBtn.addEventListener('click', addTodo);
    taskInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') addTodo();
    });
    
    filterAllBtn.addEventListener('click', () => setFilter('all'));
    filterActiveBtn.addEventListener('click', () => setFilter('active'));
    filterCompletedBtn.addEventListener('click', () => setFilter('completed'));
    
    // Filter by category
    filterCategorySelect.addEventListener('change', () => {
        currentCategoryFilter = filterCategorySelect.value;
        renderTodos();
    });
    
    // Filter by priority
    filterPrioritySelect.addEventListener('change', () => {
        currentPriorityFilter = filterPrioritySelect.value;
        renderTodos();
    });
    
    clearCompletedBtn.addEventListener('click', clearCompleted);
    generateReportBtn.addEventListener('click', generateReport);
    
    // Initialize
    loadTodos();
});
