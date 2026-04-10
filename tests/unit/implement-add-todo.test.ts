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
  test("prepends a new todo with trimmed text and correct defaults", () => {
    const existing: Todo[] = [{ id: "old-1", text: "Existing", completed: true }];

    const result = addTodo(existing, "  New task  ");

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "mock-uuid-1234",
      text: "New task",
      completed: false,
    });
    expect(result[1]).toEqual(existing[0]);
  });

  test("returns array unchanged when text is empty or whitespace", () => {
    const existing: Todo[] = [{ id: "old-1", text: "Existing", completed: false }];

    expect(addTodo(existing, "")).toEqual(existing);
    expect(addTodo(existing, "   ")).toEqual(existing);
  });

  test("does not mutate the original array", () => {
    const existing: Todo[] = [{ id: "old-1", text: "Existing", completed: false }];

    const result = addTodo(existing, "New");
    expect(existing).toHaveLength(1);
    expect(result).not.toBe(existing);
  });
});
