type Todo = { id: string; text: string; completed: boolean; createdAt: number };

type StorageModule = {
  loadTodos: () => Todo[];
  saveTodos: (todos: Todo[]) => void;
};

class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

const KEY = "todos-v1";

const loadStorageModule = (): StorageModule => {
  jest.resetModules();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("../../src/storage") as StorageModule;
};

describe("storage module", () => {
  let mem: MemoryStorage;

  beforeEach(() => {
    mem = new MemoryStorage();
    (globalThis as unknown as { window: { localStorage: MemoryStorage } }).window = {
      localStorage: mem,
    };
    (globalThis as unknown as { localStorage: MemoryStorage }).localStorage = mem;
  });

  test("loadTodos returns [] when key missing", () => {
    const { loadTodos } = loadStorageModule();
    expect(loadTodos()).toEqual([]);
  });

  test("saveTodos round-trips valid todos via loadTodos", () => {
    const { loadTodos, saveTodos } = loadStorageModule();
    const todos: Todo[] = [{ id: "a", text: "one", completed: false, createdAt: 1 }];
    saveTodos(todos);
    expect(mem.getItem(KEY)).toBe(JSON.stringify(todos));
    expect(loadTodos()).toEqual(todos);
  });

  test("loadTodos returns [] on invalid JSON", () => {
    mem.setItem(KEY, "{not-json");
    const { loadTodos } = loadStorageModule();
    expect(loadTodos()).toEqual([]);
  });

  test("loadTodos drops malformed entries", () => {
    const valid: Todo = { id: "x", text: "ok", completed: true, createdAt: 42 };
    const payload = [
      valid,
      { id: 1, text: "bad-id", completed: false, createdAt: 0 },
      { id: "y", text: 5, completed: false, createdAt: 0 },
      { id: "z", text: "t", completed: "no", createdAt: 0 },
      { id: "w", text: "t", completed: false, createdAt: "nope" },
      "not-an-object",
      null,
    ];
    mem.setItem(KEY, JSON.stringify(payload));
    const { loadTodos } = loadStorageModule();
    expect(loadTodos()).toEqual([valid]);
  });

  test("loadTodos returns [] when stored value is not an array", () => {
    mem.setItem(KEY, JSON.stringify({ not: "array" }));
    const { loadTodos } = loadStorageModule();
    expect(loadTodos()).toEqual([]);
  });

  test("saveTodos silently swallows QuotaExceededError", () => {
    const { saveTodos } = loadStorageModule();
    const throwing = {
      getItem: () => null,
      setItem: () => {
        const err = new Error("quota");
        err.name = "QuotaExceededError";
        throw err;
      },
      removeItem: () => {},
      clear: () => {},
    };
    (globalThis as unknown as { window: { localStorage: typeof throwing } }).window = {
      localStorage: throwing,
    };
    (globalThis as unknown as { localStorage: typeof throwing }).localStorage = throwing;
    expect(() => saveTodos([{ id: "a", text: "b", completed: false, createdAt: 0 }])).not.toThrow();
  });
});
