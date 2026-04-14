import type { Todo } from "../../src/todo.js";
import { STORAGE_KEY } from "../../src/todo.js";

describe("Todo interface and STORAGE_KEY constant", () => {
  it("exports STORAGE_KEY equal to 'todos'", () => {
    expect(STORAGE_KEY).toBe("todos");
  });

  it("Todo interface supports id, text, and completed fields", () => {
    const todo: Todo = { id: "abc-123", text: "Buy milk", completed: false };
    expect(todo.id).toBe("abc-123");
    expect(todo.text).toBe("Buy milk");
    expect(todo.completed).toBe(false);
  });

  it("STORAGE_KEY is a string", () => {
    expect(typeof STORAGE_KEY).toBe("string");
    expect(STORAGE_KEY.length).toBeGreaterThan(0);
  });
});
