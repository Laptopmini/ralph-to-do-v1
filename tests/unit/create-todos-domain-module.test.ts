// @ts-nocheck
import { addTodo, createTodo, deleteTodo, toggleTodo } from "../../src/todos";

describe("todos domain module", () => {
  beforeEach(() => {
    if (!global.crypto) {
      // @ts-expect-error
      global.crypto = { randomUUID: () => "uuid-" + Math.random().toString(36).slice(2) };
    }
  });

  describe("createTodo", () => {
    it("creates a todo with trimmed text, uuid id, completed false, numeric createdAt", () => {
      const before = Date.now();
      const todo = createTodo("  hello  ");
      const after = Date.now();
      expect(typeof todo.id).toBe("string");
      expect(todo.id.length).toBeGreaterThan(0);
      expect(todo.text).toBe("hello");
      expect(todo.completed).toBe(false);
      expect(typeof todo.createdAt).toBe("number");
      expect(todo.createdAt).toBeGreaterThanOrEqual(before);
      expect(todo.createdAt).toBeLessThanOrEqual(after);
    });

    it("throws when text is empty after trim", () => {
      expect(() => createTodo("   ")).toThrow();
    });

    it("throws when text is not a string", () => {
      // @ts-expect-error
      expect(() => createTodo(123)).toThrow();
      // @ts-expect-error
      expect(() => createTodo(undefined)).toThrow();
    });
  });

  describe("addTodo", () => {
    it("returns a new array with the new todo appended without mutating input", () => {
      const todos = [{ id: "a", text: "x", completed: false, createdAt: 1 }];
      const snapshot = [...todos];
      const result = addTodo(todos, "new");
      expect(result).not.toBe(todos);
      expect(result).toHaveLength(2);
      expect(result[0]).toBe(todos[0]);
      expect(result[1].text).toBe("new");
      expect(todos).toEqual(snapshot);
    });
  });

  describe("toggleTodo", () => {
    it("returns new array with matching todo's completed flipped", () => {
      const todos = [
        { id: "a", text: "x", completed: false, createdAt: 1 },
        { id: "b", text: "y", completed: true, createdAt: 2 },
      ];
      const snapshot = JSON.parse(JSON.stringify(todos));
      const result = toggleTodo(todos, "a");
      expect(result).not.toBe(todos);
      expect(result[0].completed).toBe(true);
      expect(result[1]).toBe(todos[1]);
      expect(todos).toEqual(snapshot);
    });

    it("returns original reference when no id matches", () => {
      const todos = [{ id: "a", text: "x", completed: false, createdAt: 1 }];
      const result = toggleTodo(todos, "missing");
      expect(result).toBe(todos);
    });
  });

  describe("deleteTodo", () => {
    it("returns new array without matching todo, without mutating input", () => {
      const todos = [
        { id: "a", text: "x", completed: false, createdAt: 1 },
        { id: "b", text: "y", completed: true, createdAt: 2 },
      ];
      const snapshot = [...todos];
      const result = deleteTodo(todos, "a");
      expect(result).not.toBe(todos);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("b");
      expect(todos).toEqual(snapshot);
    });

    it("returns original reference when no id matches", () => {
      const todos = [{ id: "a", text: "x", completed: false, createdAt: 1 }];
      const result = deleteTodo(todos, "missing");
      expect(result).toBe(todos);
    });
  });
});
