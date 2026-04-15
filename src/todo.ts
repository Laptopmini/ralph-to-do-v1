export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export const STORAGE_KEY = "todos";

export function loadTodos(): Todo[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === null) {
      return [];
    }
    const parsed = JSON.parse(value);
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
