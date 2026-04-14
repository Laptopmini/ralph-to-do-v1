import type { Todo } from "../../src/todo.js";
import { addTodo } from "../../src/todo.js";

beforeEach(() => {
  Object.defineProperty(globalThis, "crypto", {
    value: {
      randomUUID: () => "test-uuid-1234",
    },
    writable: true,
    configurable: true,
  });
});

describe("addTodo", () => {
  it("prepends a new todo with trimmed text, uuid id, and completed false", () => {
    const existing: Todo[] = [{ id: "old-1", text: "Existing", completed: true }];

    const result = addTodo(existing, "  New task  ");

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "test-uuid-1234",
      text: "New task",
      completed: false,
    });
    expect(result[1]).toEqual(existing[0]);
  });

  it("returns array unchanged if text is empty after trimming", () => {
    const existing: Todo[] = [{ id: "1", text: "Keep me", completed: false }];

    const result = addTodo(existing, "   ");
    expect(result).toBe(existing);
    expect(result).toHaveLength(1);
  });

  it("returns array unchanged if text is empty string", () => {
    const existing: Todo[] = [];
    const result = addTodo(existing, "");
    expect(result).toBe(existing);
    expect(result).toHaveLength(0);
  });

  it("returns a new array (does not mutate the original)", () => {
    const existing: Todo[] = [];
    const result = addTodo(existing, "Task");
    expect(result).not.toBe(existing);
  });
});
