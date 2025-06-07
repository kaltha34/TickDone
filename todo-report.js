// Todo List and Report Generation Functionality
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Todo List
    const taskInput = document.getElementById('task-input');
    const timeEstimateInput = document.getElementById('time-estimate');
    const addTaskBtn = document.getElementById('add-task-btn');
    const todoList = document.getElementById('todo-list');
    const filterAllBtn = document.getElementById('filter-all');
    const filterActiveBtn = document.getElementById('filter-active');
    const filterCompletedBtn = document.getElementById('filter-completed');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');
    const generateReportBtn = document.getElementById('generate-report-btn');
    
    // Todo List Variables
    let todos = [];
    let currentFilter = 'all';
    
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
    
    // Render todos based on current filter
    function renderTodos() {
        // Clear current list
        todoList.innerHTML = '';
        
        // Filter todos
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }
        
        // Render filtered todos
        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'todo-completed' : ''}`;
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
            
            const todoEstimate = document.createElement('div');
            todoEstimate.className = 'todo-estimate';
            todoEstimate.textContent = todo.timeEstimate ? `Estimated: ${todo.timeEstimate} min` : '';
            
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
            todoContent.appendChild(todoEstimate);
            
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
        
        if (title === '') return;
        
        const newTodo = {
            id: Date.now().toString(),
            title,
            timeEstimate,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        todos.push(newTodo);
        saveTodos();
        renderTodos();
        
        // Clear inputs
        taskInput.value = '';
        timeEstimateInput.value = '';
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
        
        const newTitle = prompt('Edit task:', todo.title);
        if (newTitle === null) return; // User canceled
        
        const newTimeEstimate = prompt('Edit time estimate (minutes):', todo.timeEstimate || '');
        
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { 
                    ...todo, 
                    title: newTitle.trim() || todo.title,
                    timeEstimate: parseInt(newTimeEstimate) || todo.timeEstimate
                };
            }
            return todo;
        });
        
        saveTodos();
        renderTodos();
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
            
            // Create PDF using direct CDN approach
            if (typeof window.jspdf === 'undefined') {
                console.error('jsPDF not found, trying alternative approach');
                // Load jsPDF dynamically if not available
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                document.head.appendChild(script);
                
                script.onload = () => {
                    const autoTableScript = document.createElement('script');
                    autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js';
                    document.head.appendChild(autoTableScript);
                    
                    autoTableScript.onload = () => {
                        setTimeout(() => generateReport(), 500); // Try again after scripts are loaded
                    };
                };
                
                return;
            }
            
            // Create PDF document
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
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
            
            // Add completed tasks
            doc.setFontSize(16);
            doc.text('Completed Tasks', 20, 90);
            
            if (completedTodos.length > 0) {
                // Create table for completed tasks
                const tableData = [];
                completedTodos.forEach((todo, index) => {
                    tableData.push([
                        index + 1,
                        todo.title,
                        todo.timeEstimate ? `${todo.timeEstimate} min` : 'N/A'
                    ]);
                });
                
                doc.autoTable({
                    startY: 100,
                    head: [['#', 'Task', 'Estimated Time']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: { fillColor: [66, 97, 238] }
                });
            } else {
                doc.setFontSize(12);
                doc.text('No tasks completed today.', 30, 100);
            }
            
            // Add quote at the bottom
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 120;
            
            doc.setFontSize(12);
            doc.setTextColor(108, 117, 125);
            doc.text('Today\'s Inspiration:', 20, finalY);
            doc.setFontStyle('italic');
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
    
    clearCompletedBtn.addEventListener('click', clearCompleted);
    generateReportBtn.addEventListener('click', generateReport);
    
    // Initialize
    loadTodos();
});
