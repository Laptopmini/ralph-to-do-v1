export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export const STORAGE_KEY = "todos";

export function loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      return [];
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function addTodo(todos: Todo[], text: string): Todo[] {
  const trimmed = text.trim();
  if (trimmed === "") {
    return todos;
  }
  const newTodo: Todo = {
    id: crypto.randomUUID(),
    text: trimmed,
    completed: false,
  };
  return [newTodo, ...todos];
}

export function toggleTodo(todos: Todo[], id: string): Todo[] {
  return todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
}

export function deleteTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter((todo) => todo.id !== id);
}
