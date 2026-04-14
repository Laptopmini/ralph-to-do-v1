import type { Todo } from "../../src/todo.js";
import { deleteTodo } from "../../src/todo.js";

describe("deleteTodo", () => {
  const todos: Todo[] = [
    { id: "1", text: "First", completed: false },
    { id: "2", text: "Second", completed: true },
  ];

  it("removes the todo with the matching id", () => {
    const result = deleteTodo(todos, "1");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("returns the original array unchanged when id does not match", () => {
    const result = deleteTodo(todos, "nonexistent");
    expect(result).toBe(todos);
  });

  it("returns a new array (does not mutate the original)", () => {
    const result = deleteTodo(todos, "2");
    expect(result).not.toBe(todos);
    expect(todos).toHaveLength(2);
  });
});
