import type { Todo } from "../../src/todo";
import { STORAGE_KEY } from "../../src/todo";

describe("Todo interface and storage constant", () => {
  it("exports STORAGE_KEY as 'todos'", () => {
    expect(STORAGE_KEY).toBe("todos");
  });

  it("Todo interface has required fields", () => {
    const todo: Todo = { id: "abc", text: "test", completed: false };
    expect(todo.id).toBe("abc");
    expect(todo.text).toBe("test");
    expect(todo.completed).toBe(false);
  });
});
