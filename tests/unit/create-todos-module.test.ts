interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TodosModule {
  createTodo(text: string): Todo;
  addTodo(todos: readonly Todo[], text: string): Todo[];
  toggleTodo(todos: readonly Todo[], id: string): Todo[];
  deleteTodo(todos: readonly Todo[], id: string): Todo[];
}

const todosModule = require("../../src/todos") as TodosModule;
const { createTodo, addTodo, toggleTodo, deleteTodo } = todosModule;

describe("createTodo", () => {
  it("returns a todo with trimmed text, generated id, and default fields", () => {
    const before = Date.now();
    const todo = createTodo("  buy milk  ");
    const after = Date.now();

    expect(typeof todo.id).toBe("string");
    expect(todo.id.length).toBeGreaterThan(0);
    expect(todo.text).toBe("buy milk");
    expect(todo.completed).toBe(false);
    expect(typeof todo.createdAt).toBe("number");
    expect(todo.createdAt).toBeGreaterThanOrEqual(before);
    expect(todo.createdAt).toBeLessThanOrEqual(after);
  });

  it("produces unique ids for distinct calls", () => {
    const a = createTodo("one");
    const b = createTodo("two");
    expect(a.id).not.toBe(b.id);
  });

  it("throws when text is empty or whitespace-only", () => {
    expect(() => createTodo("")).toThrow("Todo text must not be empty");
    expect(() => createTodo("   ")).toThrow("Todo text must not be empty");
  });

  it("throws when text is not a string", () => {
    expect(() => createTodo(undefined as unknown as string)).toThrow("Todo text must not be empty");
    expect(() => createTodo(null as unknown as string)).toThrow("Todo text must not be empty");
    expect(() => createTodo(42 as unknown as string)).toThrow("Todo text must not be empty");
  });
});

describe("addTodo", () => {
  it("returns a new array with the new todo appended", () => {
    const initial: Todo[] = [{ id: "1", text: "a", completed: false, createdAt: 1 }];
    const result = addTodo(initial, "b");

    expect(result).not.toBe(initial);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(initial[0]);
    expect(result[1].text).toBe("b");
    expect(result[1].completed).toBe(false);
    expect(initial).toHaveLength(1);
  });

  it("throws when text is invalid (delegating to createTodo)", () => {
    expect(() => addTodo([], "   ")).toThrow("Todo text must not be empty");
  });
});

describe("toggleTodo", () => {
  it("returns a new array with the matching todo's completed flipped", () => {
    const initial: Todo[] = [
      { id: "1", text: "a", completed: false, createdAt: 1 },
      { id: "2", text: "b", completed: true, createdAt: 2 },
    ];
    const result = toggleTodo(initial, "1");

    expect(result).not.toBe(initial);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: "1", text: "a", completed: true, createdAt: 1 });
    expect(result[1]).toEqual(initial[1]);
    expect(initial[0].completed).toBe(false);
  });

  it("returns the original reference when no todo matches the id", () => {
    const initial: Todo[] = [{ id: "1", text: "a", completed: false, createdAt: 1 }];
    expect(toggleTodo(initial, "missing")).toBe(initial);
  });
});

describe("deleteTodo", () => {
  it("returns a new array with the matching todo removed", () => {
    const initial: Todo[] = [
      { id: "1", text: "a", completed: false, createdAt: 1 },
      { id: "2", text: "b", completed: false, createdAt: 2 },
    ];
    const result = deleteTodo(initial, "1");

    expect(result).not.toBe(initial);
    expect(result).toEqual([initial[1]]);
    expect(initial).toHaveLength(2);
  });

  it("returns the original reference when no todo matches the id", () => {
    const initial: Todo[] = [{ id: "1", text: "a", completed: false, createdAt: 1 }];
    expect(deleteTodo(initial, "missing")).toBe(initial);
  });
});
