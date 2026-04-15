import type { Todo } from "../../src/todo";
import { deleteTodo } from "../../src/todo";

describe("deleteTodo", () => {
  const todos: Todo[] = [
    { id: "1", text: "Task A", completed: false },
    { id: "2", text: "Task B", completed: true },
  ];

  it("removes item with matching id", () => {
    const result = deleteTodo(todos, "1");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("returns new array (immutable)", () => {
    const result = deleteTodo(todos, "1");
    expect(result).not.toBe(todos);
  });

  it("returns array unchanged when id does not match", () => {
    const result = deleteTodo(todos, "nonexistent");
    expect(result).toEqual(todos);
  });
});
