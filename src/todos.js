export function createTodo(text) {
  const trimmedText = typeof text === "string" ? text.trim() : "";
  if (!trimmedText) {
    throw new Error("Todo text must not be empty");
  }

  return {
    id: crypto.randomUUID(),
    text: trimmedText,
    completed: false,
    createdAt: Date.now(),
  };
}

export function addTodo(todos, text) {
  const newTodo = createTodo(text);
  return [...todos, newTodo];
}

export function toggleTodo(todos, id) {
  let found = false;
  const newTodos = todos.map((todo) => {
    if (todo.id === id) {
      found = true;
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });

  return found ? newTodos : todos;
}

export function deleteTodo(todos, id) {
  const filteredTodos = todos.filter((todo) => todo.id !== id);
  return filteredTodos.length !== todos.length ? filteredTodos : todos;
}
