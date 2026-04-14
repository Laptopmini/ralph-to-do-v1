import type { Todo } from "../../src/todo.js";
import { addTodo } from "../../src/todo.js";

describe("addTodo", () => {
  const existing: Todo[] = [{ id: "existing-1", text: "Existing todo", completed: true }];

  it("prepends a new todo with trimmed text and completed=false", () => {
    const result = addTodo(existing, "  New item  ");

    expect(result).toHaveLength(2);
    expect(result[0].text).toBe("New item");
    expect(result[0].completed).toBe(false);
    expect(typeof result[0].id).toBe("string");
    expect(result[0].id.length).toBeGreaterThan(0);
    expect(result[1]).toEqual(existing[0]);
  });

  it("returns the original array unchanged when text is empty", () => {
    const result = addTodo(existing, "   ");
    expect(result).toBe(existing);
  });

  it("returns the original array unchanged when text is an empty string", () => {
    const result = addTodo(existing, "");
    expect(result).toBe(existing);
  });

  it("does not mutate the original array", () => {
    const original = [...existing];
    const result = addTodo(existing, "Another item");

    expect(existing).toEqual(original);
    expect(result).not.toBe(existing);
  });

  it("generates a unique id via crypto.randomUUID", () => {
    const result1 = addTodo([], "First");
    const result2 = addTodo([], "Second");

    expect(result1[0].id).not.toBe(result2[0].id);
  });
});
