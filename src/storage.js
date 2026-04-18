export function loadTodos() {
  try {
    const stored = window.localStorage.getItem("todos-v1");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((todo) => {
      return (
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
    window.localStorage.setItem("todos-v1", JSON.stringify(todos));
  } catch (e) {
    // Silently swallow QuotaExceededError
  }
}
