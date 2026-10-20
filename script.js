let tasks = [];
let editingTaskIndex = null;

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    else {
        tasks = [
            {
                id: 1,
                title: "Cooking something",
                description: "Prepare a delicious meal for the family",
                status: "pending",
                priority: "high",
                completed: false
            },

            {
                id: 2,
                title: "Cleaning the house",
                description: "Clean the living room and kitchen",
                status: "pending",
                priority: "medium",
                completed: false
            },

            {
                id: 3,
                title: "Grocery shopping",
                description: "Buy groceries for the week",
                status: "pending",
                priority: "low",
                completed: false
            },
            {
                id: 4,
                title: "Finish project report",
                description: "Complete the final report for the project",
                status: "pending",
                priority: "high",
                completed: false
            }
        ];

    }

    updateGreeting();
    renderTasks();
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = "Good Morning";

    if (hour >= 12 && hour < 18) {
        greeting = "Good Afternoon";
    } else if (hour >= 18) {
        greeting = "Good Evening";
    }

    document.getElementById("greeting").textContent = `${greeting}, User!`;
}


// Escape user-provided text before inserting it into innerHTML
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const toDo = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);

    // Render to-do tasks
    document.getElementById("to-do-tasks").innerHTML = toDo.length ? toDo.map(task =>
        `<div class="task-item">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
            <div class="task-content">
                <div class="task-title ${task.completed ? 'checked' : ''} ">${escapeHtml(task.title)}</div>
                <div class="task-description">${escapeHtml(task.description)}</div>
            </div>
            <span class="status-badge status-${task.status}">
                ${
                    task.status === 'active' ? '<i class="fa-solid fa-circle-check"></i> In Progress' :
                    task.status === 'pending' ? '<i class="fa-solid fa-circle-exclamation"></i> Pending' :
                    ''
                }
            </span>
            <div class="priority-badge priority-${task.priority}">
                <i class="fa-solid fa-circle"></i> ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </div>
            <div class="avatar"> <i class="fa-solid fa-user"></i> </div>
            <button class="icon-btn" style="width: 30px; height: 30px;" onclick="editTask(${task.id})">
                <i class="fa-solid fa-pen-to-square" style="font-size: 12px;"></i>
            </button>
            <button class="icon-btn" style="width: 30px; height: 30px;" onclick="deleteTask(${task.id})">
                <i class="fa-solid fa-trash" style="font-size: 12px;"></i>
            </button>
        </div>`
    ).join('') : '<p style="color: #9ca3af; padding: 20px;">No tasks to be done</p>';

    // Render completed tasks
    document.getElementById("completed-tasks").innerHTML = completed.length ? completed.map(task => 
        `<div class="task-item">
            <div class="task-checkbox checked" onclick="toggleTask(${task.id})"></div>
            <div class="task-content">
                <div class="task-title checked">${escapeHtml(task.title)}</div>
                <div class="task-description">${escapeHtml(task.description)}</div>
            </div>
            <span class="status-badge status-${task.status}">
                ${
                    task.status === 'completed' ? '<i class="fa-solid fa-circle-check"></i> Completed' :
                    ''
                }
            </span>
            <div class="priority-badge priority-${task.priority}">
                <i class="fa-solid fa-circle"></i> ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </div>
            <div class="avatar"><i class="fa-solid fa-user"></i> </div>
            <button class="icon-btn" style="width: 30px; height: 30px;" onclick="editTask(${task.id})">
                <i class="fa-solid fa-pen-to-square" style="font-size: 12px;"></i>
            </button>
            <button class="icon-btn" style="width: 30px; height: 30px;" onclick="deleteTask(${task.id})">
                <i class="fa-solid fa-trash" style="font-size: 12px;"></i>
            </button>
        </div>`
    ).join('') : '<p style="color: #9ca3af; padding: 20px;">No tasks have been completed</p>';

    // Update task statistics
    const taskCount = tasks.length; 
    const completedCount = completed.length;
    const pendingCount = taskCount - completedCount;
    const completionPercentage = taskCount ? Math.round((completedCount / taskCount) * 100) : 0;

    document.getElementById("task-count").textContent = pendingCount;

    document.getElementById("totalTasksValue").textContent = taskCount;
    document.getElementById("completedTasksValue").textContent = completedCount;
    document.getElementById("pendingTasksValue").textContent = pendingCount;
    document.getElementById("completionRateValue").textContent = completionPercentage + "%";

    document.getElementById("completionProgress").style.width = completionPercentage + "%";
    document.getElementById("totalTasksProgress").style.width = completionPercentage + "%";

    saveTasks();
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? 'completed' : 'pending';

        renderTasks();
    }
}

function editTask(taskId) {
    editingTaskIndex = taskId;
    const task = tasks.find(t => t.id === taskId);

    if (task) {
        
        document.getElementById("editTaskTitle").value = task.title;
        document.getElementById("editTaskDescription").value = task.description;
        document.getElementById("editTaskStatus").value = task.status;
        document.getElementById("editTaskPriority").value = task.priority;
        openUpdateTaskModal();
    }
}

function deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();
    }
}

function openAddTaskModal() {
    document.getElementById("addTaskModal").classList.add("active");
}

function openUpdateTaskModal() {
    document.getElementById("updateTaskModal").classList.add("active");
}

function closeAddTaskModal() {
    document.getElementById("addTaskModal").classList.remove("active");
    document.getElementById("addTaskForm").reset();
    editingTaskIndex = null;
}

function closeUpdateTaskModal() {
    document.getElementById("updateTaskModal").classList.remove("active");
    document.getElementById("editTaskForm").reset();
    editingTaskIndex = null;
}

document.getElementById("addTaskForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const title = document.getElementById("addTaskTitle").value;
    const description = document.getElementById("addTaskDescription").value;
    const status = document.getElementById("addTaskStatus").value;
    const priority = document.getElementById("addTaskPriority").value;

    const newTask = {
        id: Date.now(),
        title,
        description,
        status,
        priority,
        completed: status === "completed"
    };
    tasks.push(newTask);

    renderTasks();
    closeAddTaskModal();
});

document.getElementById("editTaskForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const title = document.getElementById("editTaskTitle").value;
    const description = document.getElementById("editTaskDescription").value;
    const status = document.getElementById("editTaskStatus").value;
    const priority = document.getElementById("editTaskPriority").value;

    const taskIndex = tasks.findIndex(t => t.id === editingTaskIndex);
    if (taskIndex !== -1) {
        tasks[taskIndex].title = title;
        tasks[taskIndex].description = description;
        tasks[taskIndex].status = status;
        tasks[taskIndex].priority = priority;
        tasks[taskIndex].completed = status === "completed";
    }
    renderTasks();
    closeUpdateTaskModal();
});
// const taskItem = `<div class="task-item">
//                         <div class="task-checkbox" onclick="toggleTask()"></div>
//                         <div class="task-content">
//                             <div class="task-title">Cooking something</div>
//                             <div class="task-description">Prepare a delicious meal for the family</div>
//                         </div>
//                         <span class="status-badge status"></span>
//                         <div class="priority-badge priority-high">
//                             <i class="fa-solid fa-circle"></i>
//                         </div>

//                         <div class="avatar">CF</div>
//                         <button class="icon-btn" style="width: 30px; height: 30px;" onclick="editTask()">
//                             <i class="fa-solid fa-pen-to-square" style="font-size: 12px;"></i>
//                         </button>

//                         <button class="icon-btn" style="width: 30px; height: 30px;" onclick="deleteTask()">
//                             <i class="fa-solid fa-trash" style="font-size: 12px;"></i>
//                         </button>

//                     </div>`;

loadTasks();