import type { Todo } from "../../src/todo.js";
import { toggleTodo } from "../../src/todo.js";

describe("toggleTodo", () => {
  const todos: Todo[] = [
    { id: "1", text: "First", completed: false },
    { id: "2", text: "Second", completed: true },
  ];

  it("flips completed to true for a matching uncompleted todo", () => {
    const result = toggleTodo(todos, "1");

    expect(result).toHaveLength(2);
    expect(result[0].completed).toBe(true);
    expect(result[0].id).toBe("1");
  });

  it("flips completed to false for a matching completed todo", () => {
    const result = toggleTodo(todos, "2");

    expect(result).toHaveLength(2);
    expect(result[1].completed).toBe(false);
    expect(result[1].id).toBe("2");
  });

  it("returns array unchanged when id does not match", () => {
    const result = toggleTodo(todos, "nonexistent");
    expect(result).toEqual(todos);
  });

  it("returns a new array (does not mutate the original)", () => {
    const result = toggleTodo(todos, "1");
    expect(result).not.toBe(todos);
    expect(todos[0].completed).toBe(false);
  });
});
