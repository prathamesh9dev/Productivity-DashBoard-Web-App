document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.querySelector(".login-container");
    const mainContainer = document.querySelector(".container");
    const usernameInput = document.getElementById("username");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const userNameDisplay = document.getElementById("user-name");

    const taskInput = document.getElementById("task-input");
    const taskPriority = document.getElementById("task-priority");
    const taskDeadline = document.getElementById("task-deadline");
    const addTaskBtn = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    const completedTaskList = document.getElementById("completed-task-list");

    const customTimeInput = document.getElementById("custom-time");
    const setTimeBtn = document.getElementById("set-time");
    const timerDisplay = document.getElementById("timer");
    const startTimerBtn = document.getElementById("start-timer");
    const resetTimerBtn = document.getElementById("reset-timer");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    let productiveTime = parseInt(localStorage.getItem("productiveTime")) || 0;
    let timeLeft = 0;
    let timer = null;

    function checkLogin() {
        const user = localStorage.getItem("user");
        if (user) {
            loginContainer.style.display = "none";
            mainContainer.style.display = "block";
            userNameDisplay.textContent = user;
        } else {
            loginContainer.style.display = "block";
            mainContainer.style.display = "none";
        }
    }

    loginBtn.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        if (username) {
            localStorage.setItem("user", username);
            checkLogin();
        } else {
            alert("Please enter a valid name.");
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        localStorage.removeItem("tasks");
        localStorage.removeItem("completedTasks");
        tasks = [];
        completedTasks = [];
        renderTasks();
        renderCompletedTasks();
        checkLogin();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const priority = taskPriority.value;
        const deadline = taskDeadline.value;

        if (!taskText) {
            alert("Task cannot be empty!");
            return;
        }

        const newTask = { text: taskText, priority, deadline, completed: false };
        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        taskInput.value = "";
        taskDeadline.value = "";
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.sort((a, b) => a.priority.localeCompare(b.priority));

        tasks.forEach((task, index) => {
            const taskItem = document.createElement("li");
            taskItem.className = `task-${task.priority.toLowerCase()}`;
            taskItem.innerHTML = `<strong>${task.priority}</strong>: ${task.text} (Due: ${task.deadline || "No deadline"})`;

            if (task.deadline && new Date(task.deadline) < new Date()) {
                taskItem.style.color = "red";
            }

            const completeBtn = document.createElement("button");
            completeBtn.textContent = "✅";
            completeBtn.onclick = () => completeTask(index);

            taskItem.appendChild(completeBtn);
            taskList.appendChild(taskItem);
        });
    }

    function completeTask(index) {
        completedTasks.push(tasks.splice(index, 1)[0]);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

        renderTasks();
        renderCompletedTasks();
    }

    function renderCompletedTasks() {
        completedTaskList.innerHTML = "";
        completedTasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.textContent = task.text;
            completedTaskList.appendChild(taskItem);
        });
    }

    function updateTimerDisplay() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function setCustomTime() {
        const customMinutes = parseInt(customTimeInput.value);
        if (!isNaN(customMinutes) && customMinutes > 0) {
            timeLeft = customMinutes * 60;
            updateTimerDisplay();
            startTimerBtn.disabled = false;
        } else {
            alert("Please enter a valid time in minutes.");
        }
    }

    function startTimer() {
        if (!timer) {
            if (timeLeft <= 0) {
                alert("Set a timer before starting!");
                return;
            }

            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timer);
                    timer = null;
                    alert("Time's up! Take a break.");
                    startTimerBtn.disabled = true;
                }
            }, 1000);
        }
    }

    function resetTimer() {
        clearInterval(timer);
        timer = null;
        timeLeft = 0;
        updateTimerDisplay();
        startTimerBtn.disabled = true;
    }

    addTaskBtn.addEventListener("click", addTask);
    setTimeBtn.addEventListener("click", setCustomTime);
    startTimerBtn.addEventListener("click", startTimer);
    resetTimerBtn.addEventListener("click", resetTimer);

    checkLogin();
    renderTasks();
    renderCompletedTasks();
    updateTimerDisplay();
});
