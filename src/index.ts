interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

class TodoApp {
  private todos: Todo[] = [];
  private todoListElement: HTMLUListElement;
  private todoForm: HTMLFormElement;
  private todoInput: HTMLInputElement;
  private dateDisplay: HTMLElement;
  private itemsLeftElement: HTMLElement;
  private readonly STORAGE_KEY = "ralph-todo-tasks";

  constructor() {
    this.todoListElement = document.getElementById("todo-list") as HTMLUListElement;
    this.todoForm = document.getElementById("todo-form") as HTMLFormElement;
    this.todoInput = document.getElementById("todo-input") as HTMLInputElement;
    this.dateDisplay = document.getElementById("date-display") as HTMLElement;
    this.itemsLeftElement = document.getElementById("items-left") as HTMLElement;

    this.init();
  }

  private init() {
    this.loadFromLocalStorage();
    this.displayDate();
    this.render();

    this.todoForm.addEventListener("submit", (e) => this.handleAddTodo(e));
  }

  private displayDate() {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    this.dateDisplay.textContent = new Date().toLocaleDateString(undefined, options);
  }

  private loadFromLocalStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.todos = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse todos from localStorage", e);
        this.todos = [];
      }
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
  }

  private handleAddTodo(e: SubmitEvent) {
    e.preventDefault();
    const text = this.todoInput.value.trim();
    if (!text) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };

    this.todos.push(newTodo);
    this.saveToLocalStorage();
    this.render();
    this.todoInput.value = "";
  }

  private toggleTodo(id: string) {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );
    this.saveToLocalStorage();
    this.render();
  }

  private deleteTodo(id: string) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.saveToLocalStorage();
    this.render();
  }

  private render() {
    this.todoListElement.innerHTML = "";

    this.todos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = `todo-item ${todo.completed ? "completed" : ""}`;

      li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? "checked" : ""}>
        <span class="todo-text">${this.escapeHtml(todo.text)}</span>
        <button class="delete-btn">&times;</button>
      `;

      li.querySelector(".todo-checkbox")?.addEventListener("change", () =>
        this.toggleTodo(todo.id),
      );
      li.querySelector(".delete-btn")?.addEventListener("click", () => this.deleteTodo(todo.id));

      this.todoListElement.appendChild(li);
    });

    const remaining = this.todos.filter((t) => !t.completed).length;
    this.itemsLeftElement.textContent = `${remaining} item${remaining === 1 ? "" : "s"} left`;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

new TodoApp();
