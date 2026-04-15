import type { Todo } from "../../src/todo";
import { addTodo } from "../../src/todo";

beforeEach(() => {
  Object.defineProperty(globalThis, "crypto", {
    value: {
      randomUUID: () => "mock-uuid-1234",
    },
    writable: true,
    configurable: true,
  });
});

describe("addTodo", () => {
  it("prepends a new todo with trimmed text, generated id, and completed false", () => {
    const existing: Todo[] = [{ id: "old", text: "Existing", completed: true }];
    const result = addTodo(existing, "  New task  ");

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "mock-uuid-1234",
      text: "New task",
      completed: false,
    });
    expect(result[1]).toEqual(existing[0]);
  });

  it("returns unchanged array when text is empty or whitespace", () => {
    const existing: Todo[] = [{ id: "1", text: "Existing", completed: false }];

    expect(addTodo(existing, "")).toBe(existing);
    expect(addTodo(existing, "   ")).toBe(existing);
  });

  it("works with empty initial array", () => {
    const result = addTodo([], "First task");
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("First task");
  });
});
