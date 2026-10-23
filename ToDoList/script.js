// Local State Array
let tasks = [];
let currentFilter = 'all';

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const errorMessage = document.getElementById('errorMessage');
const emptyMessage = document.getElementById('emptyMessage');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialization & Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage();
    renderTasks();

    // Event listeners
    addTaskBtn.addEventListener('click', handleAddTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTask();
    });
    clearCompletedBtn.addEventListener('click', handleClearCompleted);

    // Setup filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            renderTasks();
        });
    });
});

// Function: Add a new task (Task 3 & Task 6)
function handleAddTask() {
    const text = taskInput.value.trim();

    // Validation (Task 6)
    if (text === '') {
        showError('Please enter a valid task name!');
        return;
    }

    hideError();

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasksToLocalStorage();
    renderTasks();

    taskInput.value = '';
    taskInput.focus();
}

// Function: Toggle task completion status (Task 4)
function toggleTaskStatus(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasksToLocalStorage();
    renderTasks();
}

// Function: Delete a single task (Task 5)
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasksToLocalStorage();
    renderTasks();
}

// Function: Clear all completed tasks (Task 8)
function handleClearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasksToLocalStorage();
    renderTasks();
}

// Function: Update remaining active tasks counter (Task 8)
function updateCounter() {
    const remainingCount = tasks.filter(task => !task.completed).length;
    taskCounter.textContent = `${remainingCount} remaining`;
}

// Function: Render task UI based on current filter (Task 7)
function renderTasks() {
    taskList.innerHTML = '';

    // Filter tasks based on status
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all'
    });

    // Toggle Empty State Message
    if (filteredTasks.length === 0) {
        emptyMessage.classList.remove('d-none');
    } else {
        emptyMessage.classList.add('d-none');
    }

    // Render Each Task Element
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center py-2 px-3 ${task.completed ? 'completed bg-light' : ''}`;

        li.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <input class="form-check-input mt-0" type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskStatus(${task.id})">
                <span class="task-text">${escapeHTML(task.text)}</span>
            </div>
            <button class="btn btn-danger btn-sm py-1 px-2" onclick="deleteTask(${task.id})">Delete</button>
        `;

        taskList.appendChild(li);
    });

    updateCounter();
}

// Validation Error Utilities
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
}

function hideError() {
    errorMessage.classList.add('d-none');
}

// Utility: Escape HTML to prevent XSS issues
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Local Storage Helper Functions (Optional Challenge Requirement)
function saveTasksToLocalStorage() {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const saved = localStorage.getItem('todo_tasks');
    if (saved) {
        try {
            tasks = JSON.parse(saved);
        } catch (e) {
            tasks = [];
        }
    }
}