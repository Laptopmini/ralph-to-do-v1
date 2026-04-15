import type { Todo } from "../../src/todo.js";
import { toggleTodo } from "../../src/todo.js";

describe("toggleTodo", () => {
  const todos: Todo[] = [
    { id: "1", text: "First", completed: false },
    { id: "2", text: "Second", completed: true },
  ];

  it("flips the completed boolean of the matching todo", () => {
    const result = toggleTodo(todos, "1");
    expect(result).toHaveLength(2);
    expect(result[0].completed).toBe(true);
    expect(result[1].completed).toBe(true);
  });

  it("returns a new array, not the same reference", () => {
    const result = toggleTodo(todos, "1");
    expect(result).not.toBe(todos);
  });

  it("flips a completed todo back to incomplete", () => {
    const result = toggleTodo(todos, "2");
    expect(result[1].completed).toBe(false);
  });

  it("returns unchanged array when id is not found", () => {
    const result = toggleTodo(todos, "nonexistent");
    expect(result).toBe(todos);
  });
});
