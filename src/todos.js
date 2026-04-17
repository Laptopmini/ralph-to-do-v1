export function createTodo(text) {
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("Text must be a non-empty string");
  }

  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
  };
}

export function addTodo(todos, text) {
  const newTodo = createTodo(text);
  return [...todos, newTodo];
}

export function toggleTodo(todos, id) {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return todos;
  }

  const newTodos = [...todos];
  newTodos[index] = { ...newTodos[index], completed: !newTodos[index].completed };
  return newTodos;
}

export function deleteTodo(todos, id) {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return todos;
  }

  return todos.filter((t) => t.id !== id);
}
