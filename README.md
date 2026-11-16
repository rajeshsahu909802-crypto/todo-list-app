# My Daily Tasks: To-Do List App

A responsive to-do list built with HTML5, CSS3, and vanilla JavaScript. Tasks are saved in the browser's LocalStorage, so they survive refreshes.

## Features
- Add tasks (button or Enter key); empty/whitespace tasks are rejected
- Mark tasks complete / active again
- Delete individual tasks, or clear all completed
- Filter: All, Active, Completed
- Live "tasks left" counter and empty-state message
- Safe rendering (`textContent`, never `innerHTML` with user text)
- Handles corrupted LocalStorage data

## Project structure
```text
todo-list-app/
├── index.html
├── style.css
├── app.js
└── README.md
```

## Setup
1. Put all four files in one folder named `todo-list-app`.
2. Open the folder in VS Code.
3. Right-click `index.html` → **Open with Live Server** (or just double-click `index.html`).

## Testing checklist
- [ ] Add a task
- [ ] Try adding an empty / spaces-only task (error appears)
- [ ] Tick and untick a task (line-through toggles)
- [ ] Delete a task
- [ ] Switch All / Active / Completed
- [ ] Clear Completed
- [ ] Refresh the page (tasks remain)
- [ ] Corrupt storage: DevTools → Console → `localStorage.setItem("daily-tasks", "{bad json")` then refresh (app starts empty, no crash)
- [ ] Resize the window / use DevTools device mode (mobile layout)
- [ ] Add `<b>test</b>` as a task (shows as plain text, not bold)

## How it works
- `tasks` array holds the state; every action updates it, calls `saveTasks()`, then `renderTasks()`.
- One click listener on the `<ul>` handles all Delete buttons (event delegation); one `change` listener handles checkboxes.
- `loadTasks()` wraps `JSON.parse` in `try/catch` and validates the data shape.
