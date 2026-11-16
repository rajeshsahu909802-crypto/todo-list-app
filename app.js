// ===== 1. State =====
const STORAGE_KEY = "daily-tasks";
let tasks = [];            // the single source of truth
let currentFilter = "all"; // "all" | "active" | "completed"

// ===== 2. Grab DOM elements =====
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const errorMessage = document.getElementById("error-message");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const counter = document.getElementById("counter");
const filters = document.getElementById("filters");
const clearBtn = document.getElementById("clear-completed");

// ===== 3. LocalStorage =====
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
  }
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    // keep only well-formed tasks
    return data.filter(
      (t) =>
        t &&
        typeof t.id === "string" &&
        typeof t.text === "string" &&
        typeof t.completed === "boolean"
    );
  } catch (error) {
    console.warn("Corrupted storage data, starting fresh.", error);
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

// ===== 4. Core actions =====
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return false; // reject empty / whitespace-only

  tasks.push({ id: generateId(), text: trimmed, completed: false });
  saveTasks();
  renderTasks();
  return true;
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

// ===== 5. Filtering, counter, rendering =====
function filterTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.completed);
  if (currentFilter === "completed") return tasks.filter((t) => t.completed);
  return tasks;
}

function updateCounter() {
  const remaining = tasks.filter((t) => !t.completed).length;
  counter.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
  clearBtn.disabled = !tasks.some((t) => t.completed);
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-item" + (task.completed ? " completed" : "");
  li.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.className = "task-checkbox";
  checkbox.setAttribute("aria-label", "Mark task as completed");

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text; // SAFE: never innerHTML with user text

  const del = document.createElement("button");
  del.type = "button";
  del.className = "delete-btn";
  del.textContent = "Delete";
  del.setAttribute("aria-label", "Delete task");

  li.append(checkbox, span, del);
  return li;
}

function renderTasks() {
  taskList.replaceChildren(); // clear old items

  const visible = filterTasks();
  visible.forEach((task) => taskList.appendChild(createTaskElement(task)));

  emptyState.hidden = visible.length !== 0;
  updateCounter();
}

// ===== 6. Event listeners (attached ONCE) =====
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop page reload; also handles Enter key
  const added = addTask(input.value);
  errorMessage.hidden = added;
  if (added) input.value = "";
  input.focus();
});

input.addEventListener("input", () => {
  errorMessage.hidden = true;
});

// Event delegation: one listener on the <ul> handles every task
taskList.addEventListener("click", (event) => {
  const item = event.target.closest(".task-item");
  if (!item) return;
  const id = item.dataset.id;

  if (event.target.classList.contains("delete-btn")) {
    deleteTask(id);
  }
});

taskList.addEventListener("change", (event) => {
  if (!event.target.classList.contains("task-checkbox")) return;
  const item = event.target.closest(".task-item");
  if (item) toggleTask(item.dataset.id);
});

filters.addEventListener("click", (event) => {
  const btn = event.target.closest(".filter-btn");
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  filters.querySelectorAll(".filter-btn").forEach((b) => {
    b.classList.toggle("active", b === btn);
  });
  renderTasks();
});

clearBtn.addEventListener("click", clearCompleted);

// ===== 7. Start the app =====
tasks = loadTasks();
renderTasks();
