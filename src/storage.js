const KEY = "todos-v1";

export function loadTodos() {
  try {
    const data = localStorage.getItem(KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((todo) => {
      return (
        typeof todo === "object" &&
        todo !== null &&
        typeof todo.id === "string" &&
        typeof todo.text === "string" &&
        typeof todo.completed === "boolean" &&
        typeof todo.createdAt === "number"
      );
    });
  } catch (e) {
    return [];
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(KEY, JSON.stringify(todos));
  } catch (e) {
    if (e.name !== "QuotaExceededError") {
      // Swallowing as per spec
    }
  }
}

export { KEY };
