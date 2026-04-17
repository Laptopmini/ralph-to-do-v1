type Todo = { id: string; text: string; completed: boolean; createdAt: number };
type TodosModule = {
  createTodo: (text: string) => Todo;
  addTodo: (todos: Todo[], text: string) => Todo[];
  toggleTodo: (todos: Todo[], id: string) => Todo[];
  deleteTodo: (todos: Todo[], id: string) => Todo[];
};

function loadModule(): TodosModule {
  return require("../../src/todos") as TodosModule;
}

describe("todos domain module", () => {
  describe("createTodo", () => {
    test("returns a todo with expected shape", () => {
      const before = Date.now();
      const { createTodo } = loadModule();
      const todo = createTodo("Buy milk");
      const after = Date.now();
      expect(typeof todo.id).toBe("string");
      expect(todo.id.length).toBeGreaterThan(0);
      expect(todo.text).toBe("Buy milk");
      expect(todo.completed).toBe(false);
      expect(typeof todo.createdAt).toBe("number");
      expect(todo.createdAt).toBeGreaterThanOrEqual(before);
      expect(todo.createdAt).toBeLessThanOrEqual(after);
    });

    test("throws when text is empty or whitespace", () => {
      const { createTodo } = loadModule();
      expect(() => createTodo("")).toThrow(Error);
      expect(() => createTodo("   ")).toThrow(Error);
    });

    test("throws when text is not a string", () => {
      const { createTodo } = loadModule();
      expect(() => (createTodo as (t: unknown) => Todo)(123)).toThrow(Error);
      expect(() => (createTodo as (t: unknown) => Todo)(null)).toThrow(Error);
    });
  });

  describe("addTodo", () => {
    test("returns a new array with the new todo appended and does not mutate input", () => {
      const { addTodo } = loadModule();
      const initial: Todo[] = [{ id: "a", text: "one", completed: false, createdAt: 1 }];
      const snapshot = [...initial];
      const result = addTodo(initial, "two");
      expect(result).not.toBe(initial);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(initial[0]);
      expect(result[1].text).toBe("two");
      expect(initial).toEqual(snapshot);
    });
  });

  describe("toggleTodo", () => {
    test("returns a new array with matching todo's completed flipped; does not mutate", () => {
      const { toggleTodo } = loadModule();
      const initial: Todo[] = [
        { id: "a", text: "one", completed: false, createdAt: 1 },
        { id: "b", text: "two", completed: true, createdAt: 2 },
      ];
      const snapshot = JSON.parse(JSON.stringify(initial));
      const result = toggleTodo(initial, "a");
      expect(result).not.toBe(initial);
      expect(result[0].completed).toBe(true);
      expect(result[1].completed).toBe(true);
      expect(initial).toEqual(snapshot);
    });

    test("returns the original reference when id does not match", () => {
      const { toggleTodo } = loadModule();
      const initial: Todo[] = [{ id: "a", text: "one", completed: false, createdAt: 1 }];
      const result = toggleTodo(initial, "missing");
      expect(result).toBe(initial);
    });
  });

  describe("deleteTodo", () => {
    test("returns a new array without the matching todo; does not mutate", () => {
      const { deleteTodo } = loadModule();
      const initial: Todo[] = [
        { id: "a", text: "one", completed: false, createdAt: 1 },
        { id: "b", text: "two", completed: false, createdAt: 2 },
      ];
      const snapshot = JSON.parse(JSON.stringify(initial));
      const result = deleteTodo(initial, "a");
      expect(result).not.toBe(initial);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("b");
      expect(initial).toEqual(snapshot);
    });

    test("returns the original reference when id does not match", () => {
      const { deleteTodo } = loadModule();
      const initial: Todo[] = [{ id: "a", text: "one", completed: false, createdAt: 1 }];
      const result = deleteTodo(initial, "missing");
      expect(result).toBe(initial);
    });
  });
});
