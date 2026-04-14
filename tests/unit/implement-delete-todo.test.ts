import type { Todo } from "../../src/todo.ts";
import { deleteTodo } from "../../src/todo.ts";

describe("deleteTodo", () => {
  const baseTodos: Todo[] = [
    { id: "1", text: "First", completed: false },
    { id: "2", text: "Second", completed: true },
    { id: "3", text: "Third", completed: false },
  ];

  it("removes the item matching the given id", () => {
    const result = deleteTodo(baseTodos, "2");

    expect(result).toHaveLength(2);
    expect(result.find((t: Todo) => t.id === "2")).toBeUndefined();
    expect(result[0].id).toBe("1");
    expect(result[1].id).toBe("3");
  });

  it("returns a new array (immutable)", () => {
    const result = deleteTodo(baseTodos, "1");

    expect(result).not.toBe(baseTodos);
  });

  it("returns array unchanged if id does not match", () => {
    const result = deleteTodo(baseTodos, "nonexistent");

    expect(result).toBe(baseTodos);
  });
});
