import type { Todo } from "../../src/todo.js";
import { deleteTodo } from "../../src/todo.js";

describe("deleteTodo", () => {
  const todos: Todo[] = [
    { id: "1", text: "First", completed: false },
    { id: "2", text: "Second", completed: true },
    { id: "3", text: "Third", completed: false },
  ];

  it("removes the todo with the matching id", () => {
    const result = deleteTodo(todos, "2");
    expect(result).toHaveLength(2);
    expect(result.find((t: { id: string }) => t.id === "2")).toBeUndefined();
    expect(result[0].id).toBe("1");
    expect(result[1].id).toBe("3");
  });

  it("returns a new array, not the same reference", () => {
    const result = deleteTodo(todos, "1");
    expect(result).not.toBe(todos);
  });

  it("returns unchanged array when id is not found", () => {
    const result = deleteTodo(todos, "nonexistent");
    expect(result).toBe(todos);
  });
});
