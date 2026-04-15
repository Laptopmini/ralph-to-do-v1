import type { Todo } from "../../src/todo";
import { STORAGE_KEY } from "../../src/todo";

describe("Todo interface and STORAGE_KEY constant", () => {
  it("exports STORAGE_KEY as 'todos'", () => {
    expect(STORAGE_KEY).toBe("todos");
  });

  it("Todo interface has required fields with correct types", () => {
    const todo: Todo = {
      id: "test-id",
      text: "test text",
      completed: false,
    };
    expect(todo.id).toBe("test-id");
    expect(todo.text).toBe("test text");
    expect(todo.completed).toBe(false);
  });
});
