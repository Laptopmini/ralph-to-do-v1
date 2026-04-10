import type { Todo } from "../../src/todo";
import { STORAGE_KEY } from "../../src/todo";

describe("Todo interface and STORAGE_KEY", () => {
  test("STORAGE_KEY is exported and equals 'todos'", () => {
    expect(STORAGE_KEY).toBe("todos");
  });

  test("Todo type has correct shape", () => {
    const todo: Todo = {
      id: "abc-123",
      text: "Buy groceries",
      completed: false,
    };
    expect(todo.id).toBe("abc-123");
    expect(todo.text).toBe("Buy groceries");
    expect(todo.completed).toBe(false);
  });
});
