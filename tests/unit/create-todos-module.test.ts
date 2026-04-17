type Todo = { id: string; text: string; completed: boolean; createdAt: number };

type TodosModule = {
  createTodo: (text: string) => Todo;
  addTodo: (todos: Todo[], text: string) => Todo[];
  toggleTodo: (todos: Todo[], id: string) => Todo[];
  deleteTodo: (todos: Todo[], id: string) => Todo[];
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const todos = require("../../src/todos") as TodosModule;

describe("createTodo", () => {
  test("returns object with expected fields", () => {
    const before = Date.now();
    const t = todos.createTodo("hello");
    const after = Date.now();
    expect(typeof t.id).toBe("string");
    expect(t.id.length).toBeGreaterThan(0);
    expect(t.text).toBe("hello");
    expect(t.completed).toBe(false);
    expect(typeof t.createdAt).toBe("number");
    expect(t.createdAt).toBeGreaterThanOrEqual(before);
    expect(t.createdAt).toBeLessThanOrEqual(after);
  });

  test("generates unique ids", () => {
    const a = todos.createTodo("a");
    const b = todos.createTodo("b");
    expect(a.id).not.toBe(b.id);
  });

  test("throws on empty/whitespace text", () => {
    expect(() => todos.createTodo("")).toThrow();
    expect(() => todos.createTodo("   ")).toThrow();
  });

  test("throws on non-string text", () => {
    expect(() => todos.createTodo(undefined as unknown as string)).toThrow();
    expect(() => todos.createTodo(123 as unknown as string)).toThrow();
    expect(() => todos.createTodo(null as unknown as string)).toThrow();
  });
});

describe("addTodo", () => {
  test("returns new array with todo appended, does not mutate input", () => {
    const initial: Todo[] = [{ id: "1", text: "a", completed: false, createdAt: 1 }];
    const snapshot = [...initial];
    const next = todos.addTodo(initial, "b");
    expect(next).not.toBe(initial);
    expect(initial).toEqual(snapshot);
    expect(next).toHaveLength(2);
    expect(next[0]).toEqual(initial[0]);
    expect(next[1].text).toBe("b");
    expect(next[1].completed).toBe(false);
  });
});

describe("toggleTodo", () => {
  test("flips completed flag without mutating input", () => {
    const initial: Todo[] = [
      { id: "1", text: "a", completed: false, createdAt: 1 },
      { id: "2", text: "b", completed: true, createdAt: 2 },
    ];
    const snapshot = JSON.parse(JSON.stringify(initial));
    const next = todos.toggleTodo(initial, "1");
    expect(next).not.toBe(initial);
    expect(initial).toEqual(snapshot);
    expect(next[0].completed).toBe(true);
    expect(next[1].completed).toBe(true);
  });

  test("returns original reference when no match", () => {
    const initial: Todo[] = [{ id: "1", text: "a", completed: false, createdAt: 1 }];
    const result = todos.toggleTodo(initial, "missing");
    expect(result).toBe(initial);
  });
});

describe("deleteTodo", () => {
  test("returns new array without the matching todo, does not mutate", () => {
    const initial: Todo[] = [
      { id: "1", text: "a", completed: false, createdAt: 1 },
      { id: "2", text: "b", completed: false, createdAt: 2 },
    ];
    const snapshot = JSON.parse(JSON.stringify(initial));
    const next = todos.deleteTodo(initial, "1");
    expect(next).not.toBe(initial);
    expect(initial).toEqual(snapshot);
    expect(next).toEqual([initial[1]]);
  });

  test("returns original reference when no match", () => {
    const initial: Todo[] = [{ id: "1", text: "a", completed: false, createdAt: 1 }];
    const result = todos.deleteTodo(initial, "missing");
    expect(result).toBe(initial);
  });
});
