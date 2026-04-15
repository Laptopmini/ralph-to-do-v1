import type { Todo } from "../../src/todo.js";
import { addTodo } from "../../src/todo.js";

const mockUUID = "test-uuid-1234";
Object.defineProperty(globalThis, "crypto", {
  value: { randomUUID: () => mockUUID },
});

describe("addTodo", () => {
  const existing: Todo[] = [{ id: "existing-1", text: "Existing", completed: true }];

  it("prepends a new todo with trimmed text, unique id, and completed false", () => {
    const result = addTodo(existing, "  New task  ");
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: mockUUID,
      text: "New task",
      completed: false,
    });
    expect(result[1]).toEqual(existing[0]);
  });

  it("returns unchanged array when text is empty after trim", () => {
    const result = addTodo(existing, "   ");
    expect(result).toBe(existing);
  });

  it("returns unchanged array when text is empty string", () => {
    const result = addTodo(existing, "");
    expect(result).toBe(existing);
  });

  it("works with an empty existing array", () => {
    const result = addTodo([], "First task");
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("First task");
    expect(result[0].completed).toBe(false);
  });
});
