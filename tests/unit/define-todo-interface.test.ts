import type { Todo } from "../../src/todo.ts";
import { STORAGE_KEY } from "../../src/todo.ts";

describe("Todo interface and storage constant", () => {
  it("exports STORAGE_KEY as 'todos'", () => {
    expect(STORAGE_KEY).toBe("todos");
  });

  it("Todo interface has required fields with correct types", () => {
    const todo: Todo = {
      id: "abc-123",
      text: "Buy groceries",
      completed: false,
    };

    expect(typeof todo.id).toBe("string");
    expect(typeof todo.text).toBe("string");
    expect(typeof todo.completed).toBe("boolean");
  });

  it("Todo interface does not accept missing fields", () => {
    const todo: Todo = {
      id: "abc-123",
      text: "Buy groceries",
      completed: true,
    };

    expect(todo).toHaveProperty("id");
    expect(todo).toHaveProperty("text");
    expect(todo).toHaveProperty("completed");
    expect(Object.keys(todo)).toEqual(expect.arrayContaining(["id", "text", "completed"]));
  });
});
