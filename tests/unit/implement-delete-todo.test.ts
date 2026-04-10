import type { Todo } from "../../src/todo";
import { deleteTodo } from "../../src/todo";

describe("deleteTodo", () => {
  const todos: Todo[] = [
    { id: "1", text: "First", completed: false },
    { id: "2", text: "Second", completed: true },
    { id: "3", text: "Third", completed: false },
  ];

  test("removes the item matching the given id", () => {
    const result = deleteTodo(todos, "2");

    expect(result).toHaveLength(2);
    expect(result.find((t: Todo) => t.id === "2")).toBeUndefined();
    expect(result[0].id).toBe("1");
    expect(result[1].id).toBe("3");
  });

  test("returns array unchanged when id does not match", () => {
    const result = deleteTodo(todos, "nonexistent");
    expect(result).toEqual(todos);
  });

  test("does not mutate the original array", () => {
    const result = deleteTodo(todos, "1");
    expect(todos).toHaveLength(3);
    expect(result).not.toBe(todos);
  });
});
