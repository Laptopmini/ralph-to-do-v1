const state = {
  todos: [],
  filter: "all",
};

import { loadTodos, saveTodos } from "./storage.js";
import { addTodo, toggleTodo, deleteTodo } from "./todos.js";

function render() {
  const todoList = document.querySelector('[data-testid="todo-list"]');
  if (!todoList) return;

  const todoCount = document.querySelector('[data-testid="todo-count"]');
  const emptyState = document.querySelector('[data-testid="empty-state"]');

  let filteredTodos = state.todos;
  if (state.filter === "active") {
    filteredTodos = state.todos.filter((t) => !t.completed);
  } else if (state.filter === "completed") {
    filteredTodos = state.todos.filter((t) => t.completed);
  }

  todoList.innerHTML = "";
  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.setAttribute("data-testid", `todo-item-${todo.id}`);
    li.classList.add("todo-item");

    if (todo.completed) {
      li.classList.add("todo--completed");
    }

    // For entering animation, we'll handle it in the add logic or via a temporary class if needed
    // But the plan says "apply transient CSS classes .is-entering ... and .is-leaving"

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("data-testid", `todo-checkbox-${todo.id}`);
    checkbox.addEventListener("change", () => {
      state.todos = toggleTodo(state.todos, todo.id);
      saveTodos(state.todos);
      render();
    });

    const textSpan = document.createElement("span");
    textSpan.textContent = todo.text;
    textSpan.setAttribute("data-testid", `todo-text-${todo.id}`);
    if (todo.completed) {
      textSpan.classList.add("todo--completed");
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("data-testid", `todo-delete-${todo.id}`);
    deleteBtn.addEventListener("click", () => {
      li.classList.add("is-leaving");
      setTimeout(() => {
        state.todos = deleteTodo(state.todos, todo.id);
        saveTodos(state.todos);
        render();
      }, 200);
    });

    li.append(checkbox, textSpan, deleteBtn);
    todoList.appendChild(li);
  });

  // Update count
  const activeCount = state.todos.filter((t) => !t.completed).length;
  if (todoCount) {
    todoCount.textContent = `${activeCount} ${activeCount === 1 ? "item" : "items"} left`;
  }

  // Update empty state
  if (emptyState) {
    emptyState.style.display = state.todos.length === 0 ? "block" : "none";
  }

  // Update filter buttons
  const filters = ["all", "active", "completed"];
  filters.forEach((f) => {
    const btn = document.querySelector(`[data-testid="filter-${f}"]`);
    if (btn) {
      btn.setAttribute("aria-pressed", state.filter === f ? "true" : "false");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  state.todos = loadTodos();
  render();

  const form = document.querySelector('[data-testid="todo-form"]');
  const input = document.querySelector('[data-testid="todo-input"]');

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value;
    if (!text.trim()) return;

    try {
      // Note: addTodo is pure and returns new array, but we also need to handle the animation class if possible.
      // The plan says "Add transient CSS classes .is-entering ... on newly added <li>". 
      // To do this cleanly without a framework, we might need to render then find the new element or use a different approach.
      // Let's try appending to the list first for the animation.

      state.todos = addTodo(state.todos, text);
      saveTodos(state.todos);
      input.value = "";
      input.focus();
      render();
      
      // Find the newly added element to apply is-entering
      const lastId = state.todos[state.todos.length - 1].id;
      const newLi = document.querySelector(`[data-testid="todo-item-${lastId}"]`);
      if (newLi) {
        newLi.classList.add("is-entering");
        setTimeout(() => newLi.classList.remove("is-entering"), 200);
      }

    } catch (err) {
      console.error(err);
    }
  });

  // Filter buttons
  ["all", "active", "completed"].forEach((f) => {
    const btn = document.querySelector(`[data-testid="filter-${f}"]`);
    btn?.addEventListener("click", () => {
      state.filter = f;
      render();
    });
  });
});

export { render };
