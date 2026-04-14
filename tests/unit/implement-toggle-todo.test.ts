import type { Todo } from "../../src/todo.ts";
import { toggleTodo } from "../../src/todo.ts";

describe("toggleTodo", () => {
  const baseTodos: Todo[] = [
    { id: "1", text: "First", completed: false },
    { id: "2", text: "Second", completed: true },
  ];

  it("flips completed from false to true for matching id", () => {
    const result = toggleTodo(baseTodos, "1");

    expect(result).toHaveLength(2);
    expect(result[0].completed).toBe(true);
    expect(result[1].completed).toBe(true);
  });

  it("flips completed from true to false for matching id", () => {
    const result = toggleTodo(baseTodos, "2");

    expect(result).toHaveLength(2);
    expect(result[0].completed).toBe(false);
    expect(result[1].completed).toBe(false);
  });

  it("returns a new array (immutable)", () => {
    const result = toggleTodo(baseTodos, "1");

    expect(result).not.toBe(baseTodos);
  });

  it("returns array unchanged if id does not match", () => {
    const result = toggleTodo(baseTodos, "nonexistent");

    expect(result).toBe(baseTodos);
  });
});
