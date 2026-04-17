interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface StorageModule {
  loadTodos(): Todo[];
  saveTodos(todos: Todo[]): void;
}

let store: Record<string, string> = {};

const localStorageMock = {
  getItem: jest.fn((key: string): string | null => (Object.hasOwn(store, key) ? store[key] : null)),
  setItem: jest.fn((key: string, value: string): void => {
    store[key] = value;
  }),
  removeItem: jest.fn((key: string): void => {
    delete store[key];
  }),
  clear: jest.fn((): void => {
    store = {};
  }),
};

(globalThis as unknown as { window: { localStorage: typeof localStorageMock } }).window = {
  localStorage: localStorageMock,
};

const storageModule = require("../../src/storage") as StorageModule;
const { loadTodos, saveTodos } = storageModule;

beforeEach(() => {
  store = {};
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.setItem.mockImplementation((key: string, value: string): void => {
    store[key] = value;
  });
  localStorageMock.getItem.mockImplementation((key: string): string | null =>
    Object.hasOwn(store, key) ? store[key] : null,
  );
});

describe("loadTodos", () => {
  it("returns [] when the todos-v1 key is missing", () => {
    expect(loadTodos()).toEqual([]);
    expect(localStorageMock.getItem).toHaveBeenCalledWith("todos-v1");
  });

  it("returns [] when the stored value is invalid JSON", () => {
    store["todos-v1"] = "{not valid";
    expect(loadTodos()).toEqual([]);
  });

  it("returns [] when the parsed value is not an array", () => {
    store["todos-v1"] = JSON.stringify({ foo: "bar" });
    expect(loadTodos()).toEqual([]);
  });

  it("returns the stored array and drops malformed entries", () => {
    const valid: Todo = { id: "a", text: "buy milk", completed: false, createdAt: 1 };
    const wrongIdType = { id: 1, text: "x", completed: false, createdAt: 2 };
    const missingField = { id: "b", text: "y", completed: false };
    const wrongCompletedType = { id: "c", text: "z", completed: "nope", createdAt: 4 };
    store["todos-v1"] = JSON.stringify([
      valid,
      wrongIdType,
      missingField,
      wrongCompletedType,
      null,
      "oops",
    ]);
    expect(loadTodos()).toEqual([valid]);
  });

  it("returns [] when localStorage getItem throws", () => {
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error("boom");
    });
    expect(loadTodos()).toEqual([]);
  });
});

describe("saveTodos", () => {
  it("writes JSON-stringified todos to the todos-v1 key", () => {
    const todos: Todo[] = [{ id: "a", text: "hi", completed: false, createdAt: 1 }];
    saveTodos(todos);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("todos-v1", JSON.stringify(todos));
    expect(store["todos-v1"]).toBe(JSON.stringify(todos));
  });

  it("silently swallows QuotaExceededError", () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      const err = new Error("quota");
      err.name = "QuotaExceededError";
      throw err;
    });
    expect(() => saveTodos([])).not.toThrow();
  });
});
