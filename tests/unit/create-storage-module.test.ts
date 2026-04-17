type Todo = { id: string; text: string; completed: boolean; createdAt: number };
type StorageModule = {
  loadTodos: () => Todo[];
  saveTodos: (todos: Todo[]) => void;
};

const KEY = "todos-v1";

class MemoryStorage {
  private store = new Map<string, string>();
  quotaExceeded = false;
  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }
  setItem(key: string, value: string): void {
    if (this.quotaExceeded) {
      const err = new Error("Quota exceeded") as Error & { name: string };
      err.name = "QuotaExceededError";
      throw err;
    }
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
  raw(): Map<string, string> {
    return this.store;
  }
}

let storageMock: MemoryStorage;

beforeEach(() => {
  storageMock = new MemoryStorage();
  (globalThis as unknown as { localStorage: MemoryStorage }).localStorage = storageMock;
  jest.resetModules();
});

function loadModule(): StorageModule {
  return require("../../src/storage") as StorageModule;
}

describe("storage module", () => {
  test("loadTodos returns empty array when key is missing", () => {
    const { loadTodos } = loadModule();
    expect(loadTodos()).toEqual([]);
  });

  test("loadTodos returns empty array on invalid JSON", () => {
    storageMock.setItem(KEY, "{not valid json");
    const { loadTodos } = loadModule();
    expect(loadTodos()).toEqual([]);
  });

  test("loadTodos returns empty array when parsed value is not an array", () => {
    storageMock.setItem(KEY, JSON.stringify({ foo: "bar" }));
    const { loadTodos } = loadModule();
    expect(loadTodos()).toEqual([]);
  });

  test("loadTodos returns only well-formed todo entries", () => {
    const good: Todo = { id: "a", text: "hello", completed: false, createdAt: 123 };
    const bad1 = { id: 1, text: "x", completed: false, createdAt: 1 };
    const bad2 = { id: "b", text: "x", completed: "nope", createdAt: 1 };
    const bad3 = { id: "c", text: "x", completed: true };
    storageMock.setItem(KEY, JSON.stringify([good, bad1, bad2, bad3]));
    const { loadTodos } = loadModule();
    expect(loadTodos()).toEqual([good]);
  });

  test("saveTodos writes JSON string to the todos-v1 key", () => {
    const { saveTodos } = loadModule();
    const todos: Todo[] = [{ id: "a", text: "hi", completed: false, createdAt: 1 }];
    saveTodos(todos);
    const written = storageMock.getItem(KEY);
    expect(written).not.toBeNull();
    expect(JSON.parse(written as string)).toEqual(todos);
  });

  test("saveTodos silently swallows QuotaExceededError", () => {
    const { saveTodos } = loadModule();
    storageMock.quotaExceeded = true;
    expect(() =>
      saveTodos([{ id: "a", text: "hi", completed: false, createdAt: 1 }]),
    ).not.toThrow();
  });
});
