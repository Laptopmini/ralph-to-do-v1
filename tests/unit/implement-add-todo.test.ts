import type { Todo } from "../../src/todo.ts";
import { addTodo } from "../../src/todo.ts";

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
  it("prepends a new todo with trimmed text and correct defaults", () => {
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

  it("returns array unchanged if text is empty or whitespace", () => {
    const existing: Todo[] = [{ id: "old-1", text: "Existing", completed: false }];

    expect(addTodo(existing, "")).toBe(existing);
    expect(addTodo(existing, "   ")).toBe(existing);
    expect(addTodo(existing, "\t\n")).toBe(existing);
  });

  it("works with an empty initial array", () => {
    const result = addTodo([], "First todo");

    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("First todo");
    expect(result[0].completed).toBe(false);
    expect(result[0].id).toBe("test-uuid-1234");
  });
});
