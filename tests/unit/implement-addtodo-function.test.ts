import type { Todo } from "../../src/todo";
import { addTodo } from "../../src/todo";

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
  it("prepends a new todo with correct fields", () => {
    const existing: Todo[] = [{ id: "old", text: "Existing", completed: true }];

    const result = addTodo(existing, "New task");

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "test-uuid-1234",
      text: "New task",
      completed: false,
    });
    expect(result[1]).toEqual(existing[0]);
  });

  it("trims whitespace from text", () => {
    const result = addTodo([], "  spaced text  ");

    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("spaced text");
  });

  it("returns array unchanged if text is empty", () => {
    const existing: Todo[] = [{ id: "1", text: "Keep me", completed: false }];

    const result = addTodo(existing, "");
    expect(result).toBe(existing);
  });

  it("returns array unchanged if text is only whitespace", () => {
    const existing: Todo[] = [{ id: "1", text: "Keep me", completed: false }];

    const result = addTodo(existing, "   ");
    expect(result).toBe(existing);
  });
});
