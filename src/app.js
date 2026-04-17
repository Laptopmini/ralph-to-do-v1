import { loadTodos, saveTodos } from "./storage.js";
import { addTodo, deleteTodo, toggleTodo } from "./todos.js";

const state = {
  todos: [],
  filter: "all",
};

const elements = {
  todoInput: document.querySelector('[data-testid="todo-input"]'),
  todoSubmit: document.querySelector('[data-testid="todo-submit"]'),
  todoList: document.querySelector('[data-testid="todo-list"]'),
  todoCount: document.querySelector('[data-testid="todo-count"]'),
  emptyState: document.querySelector('[data-testid="empty-state"]'),
  filterAll: document.querySelector('[data-testid="filter-all"]'),
  filterActive: document.querySelector('[data-testid="filter-active"]'),
  filterCompleted: document.querySelector('[data-testid="filter-completed"]'),
};

export function render() {
  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === "active") return !todo.completed;
    if (state.filter === "completed") return todo.completed;
    return true;
  });

  elements.todoList.innerHTML = "";
  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.setAttribute("data-testid", "todo-item");
    li.classList.add("is-entering");

    li.innerHTML = `
      <input type="checkbox" data-testid="todo-toggle" ${todo.completed ? "checked" : ""}>
      <span data-testid="todo-text">${todo.text}</span>
      <button data-testid="todo-delete">Delete</button>
    `;

    const textSpan = li.querySelector('[data-testid="todo-text"]');
    const toggleInput = li.querySelector('[data-testid="todo-toggle"]');
    const deleteBtn = li.querySelector('[data-testid="todo-delete"]');

    toggleInput.addEventListener("change", () => {
      state.todos = toggleTodo(state.todos, todo.id);
      saveTodos(state.todos);
      render();
    });

    deleteBtn.addEventListener("click", () => {
      li.classList.replace("is-entering", "is-leaving");
      setTimeout(() => {
        state.todos = deleteTodo(state.todos, todo.id);
        saveTodos(state.todos);
        render();
      }, 200);
    });

    elements.todoList.appendChild(li);
    // Trigger reflow for animation
    void li.offsetWidth;
    li.classList.remove("is-entering");
  });

  const activeCount = state.todos.filter((t) => !t.completed).length;
  elements.todoCount.textContent = activeCount;

  if (state.todos.length === 0) {
    elements.emptyState.classList.remove("hidden");
    elements.emptyState.style.display = "block";
  } else {
    elements.emptyState.classList.add("hidden");
    elements.emptyState.style.display = "none";
  }

  elements.filterAll.setAttribute("aria-pressed", state.filter === "all" ? "true" : "false");
  elements.filterActive.setAttribute("aria-pressed", state.filter === "active" ? "true" : "false");
  elements.filterCompleted.setAttribute(
    "aria-pressed",
    state.filter === "completed" ? "true" : "false",
  );
}

document.addEventListener("DOMContentLoaded", () => {
  state.todos = loadTodos();
  render();

  elements.todoSubmit.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = elements.todoInput.value.trim();
    if (text) {
      state.todos = addTodo(state.todos, text);
      saveTodos(state.todos);
      elements.todoInput.value = "";
      render();
    }
  });

  // The form itself is what receives the submit event in many implementations,
  // but for this task I'll assume it's a button or handle input keyup/form submission.
  // Re-reading test: page.getByTestId("todo-submit").click()
  // This implies todo-submit is likely a button inside a form or the button itself.
  // Let's adjust to listen for submit on a parent form if possible,
  // but the test says click on todo-submit.

  elements.todoSubmit.addEventListener("click", (e) => {
    if (e.target.closest("form")) return; // let form handle it
    const text = elements.todoInput.value.trim();
    if (text) {
      state.todos = addTodo(state.todos, text);
      saveTodos(state.todos);
      elements.todoInput.value = "";
      render();
    }
  });

  // If todo-submit is a button inside a form:
  const form = elements.todoSubmit.closest("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = elements.todoInput.value.trim();
      if (text) {
        state.todos = addTodo(state.todos, text);
        saveTodos(state.todos);
        elements.todoInput.value = "";
        render();
      }
    });
  }

  elements.filterAll.addEventListener("click", () => {
    state.filter = "all";
    render();
  });

  elements.filterActive.addEventListener("click", () => {
    state.filter = "active";
    render();
  });

  elements.filterCompleted.addEventListener("click", () => {
    state.filter = "completed";
    render();
  });
});
