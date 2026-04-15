import type { Todo } from "../../src/todo";
import { toggleTodo } from "../../src/todo";

describe("toggleTodo", () => {
  const todos: Todo[] = [
    { id: "1", text: "Task A", completed: false },
    { id: "2", text: "Task B", completed: true },
  ];

  it("flips completed boolean for matching id", () => {
    const result = toggleTodo(todos, "1");
    expect(result).toHaveLength(2);
    expect(result[0].completed).toBe(true);
    expect(result[1].completed).toBe(true);
  });

  it("returns new array (immutable)", () => {
    const result = toggleTodo(todos, "1");
    expect(result).not.toBe(todos);
  });

  it("returns array unchanged when id does not match", () => {
    const result = toggleTodo(todos, "nonexistent");
    expect(result).toEqual(todos);
  });
});
