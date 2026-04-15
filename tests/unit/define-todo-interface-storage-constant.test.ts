import type { Todo } from "../../src/todo.js";
import { STORAGE_KEY } from "../../src/todo.js";

describe("Todo interface and STORAGE_KEY constant", () => {
  it("exports STORAGE_KEY as the string 'todos'", () => {
    expect(STORAGE_KEY).toBe("todos");
  });

  it("Todo interface has correct shape", () => {
    const todo: Todo = { id: "abc-123", text: "Buy milk", completed: false };
    expect(todo).toHaveProperty("id");
    expect(todo).toHaveProperty("text");
    expect(todo).toHaveProperty("completed");
    expect(typeof todo.id).toBe("string");
    expect(typeof todo.text).toBe("string");
    expect(typeof todo.completed).toBe("boolean");
  });

  it("STORAGE_KEY is not an empty string", () => {
    expect(STORAGE_KEY.length).toBeGreaterThan(0);
  });
});
