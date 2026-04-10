import type { Todo } from "../../src/todo";
import { toggleTodo } from "../../src/todo";

describe("toggleTodo", () => {
  const todos: Todo[] = [
    { id: "1", text: "First", completed: false },
    { id: "2", text: "Second", completed: true },
  ];

  test("flips completed boolean for matching id", () => {
    const result = toggleTodo(todos, "1");

    expect(result).toHaveLength(2);
    expect(result[0].completed).toBe(true);
    expect(result[1].completed).toBe(true);
  });

  test("returns array unchanged when id does not match", () => {
    const result = toggleTodo(todos, "nonexistent");
    expect(result).toEqual(todos);
  });

  test("does not mutate the original array", () => {
    const result = toggleTodo(todos, "2");
    expect(todos[1].completed).toBe(true);
    expect(result).not.toBe(todos);
  });
});
