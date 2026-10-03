const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const loadSamplesBtn = document.querySelector("#loadSamplesBtn");
const taskList = document.querySelector("#taskList");
const taskMessage = document.querySelector("#taskMessage");
const totalCount = document.querySelector("#totalCount");
const pendingCount = document.querySelector("#pendingCount");
const completedCount = document.querySelector("#completedCount");

let nextTaskNumber = 1;

function createTaskElement(taskText, taskId) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    taskItem.dataset.taskId = taskId;
    taskItem.dataset.state = "pending";

    const textSpan = document.createElement("span");
    textSpan.classList.add("task-text");
    textSpan.textContent = taskText;

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.classList.add("complete-btn");
    completeButton.textContent = "Complete";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.classList.add("edit-btn");
    editButton.textContent = "Edit";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("remove-btn");
    removeButton.textContent = "Remove";

    taskItem.append(textSpan, completeButton, editButton, removeButton);

    return taskItem;
}

function addTask(taskText) {
    const trimmedText = taskText.trim();

    if (!trimmedText) {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }

    const taskId = `task-${nextTaskNumber++}`;
    const taskItem = createTaskElement(trimmedText, taskId);

    taskList.append(taskItem);
    taskInput.value = "";
    taskMessage.textContent = "";
    updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
    const isCompleted = taskItem.classList.toggle("completed");
    taskItem.dataset.state = isCompleted ? "completed" : "pending";
    updateTaskCounts();
}

function beginTaskEdit(taskItem) {
    const textSpan = taskItem.querySelector(".task-text");
    const editButton = taskItem.querySelector(".edit-btn");

    if (!textSpan || !editButton) {
        return;
    }

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.classList.add("edit-input");
    editInput.value = textSpan.textContent;

    textSpan.replaceWith(editInput);
    editButton.textContent = "Save";
    editInput.focus();
}

function saveTaskEdit(taskItem) {
    const editInput = taskItem.querySelector(".edit-input");
    const editButton = taskItem.querySelector(".edit-btn");

    if (!editInput || !editButton) {
        return;
    }

    const editedText = editInput.value.trim();

    if (!editedText) {
        taskMessage.textContent = "Task cannot be empty";
        editInput.focus();
        return;
    }

    const newTextSpan = document.createElement("span");
    newTextSpan.classList.add("task-text");
    newTextSpan.textContent = editedText;

    editInput.replaceWith(newTextSpan);
    editButton.textContent = "Edit";
    taskMessage.textContent = "";
}

function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
}

function updateTaskCounts() {
    const taskItems = [...taskList.querySelectorAll(".task-item")];
    const total = taskItems.length;
    const completed = taskItems.filter(
        ({ dataset }) => dataset.state === "completed"
    ).length;
    const pending = taskItems.filter(
        ({ dataset }) => dataset.state === "pending"
    ).length;

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}

function handleTaskListClick(event) {
    const clickedButton = event.target;

    if (!clickedButton.matches("button")) {
        return;
    }

    const taskItem = clickedButton.closest(".task-item");

    if (!taskItem) {
        return;
    }

    if (clickedButton.classList.contains("complete-btn")) {
        toggleTaskComplete(taskItem);
    } else if (clickedButton.classList.contains("edit-btn")) {
        if (clickedButton.textContent === "Save") {
            saveTaskEdit(taskItem);
        } else {
            beginTaskEdit(taskItem);
        }
    } else if (clickedButton.classList.contains("remove-btn")) {
        removeTask(taskItem);
    }
}

function loadSampleTasks() {
    const sampleTasks = [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ];

    const fragment = document.createDocumentFragment();

    sampleTasks.forEach((taskText) => {
        const taskId = `task-${nextTaskNumber++}`;
        const taskItem = createTaskElement(taskText, taskId);
        fragment.append(taskItem);
    });

    taskList.append(fragment);
    taskMessage.textContent = "";
    updateTaskCounts();
}

addTaskBtn.addEventListener("click", () => {
    addTask(taskInput.value);
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask(taskInput.value);
    }
});

taskList.addEventListener("click", handleTaskListClick);

updateTaskCounts();
