import { loadTodos, STORAGE_KEY } from "../../src/todo";

const mockStorage: Record<string, string> = {};

beforeEach(() => {
  for (const key in mockStorage) {
    delete mockStorage[key];
  }

  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
    },
    writable: true,
    configurable: true,
  });
});

describe("loadTodos", () => {
  it("returns parsed array from localStorage", () => {
    const todos = [{ id: "1", text: "Buy milk", completed: false }];
    mockStorage[STORAGE_KEY] = JSON.stringify(todos);

    const result = loadTodos();
    expect(result).toEqual(todos);
  });

  it("returns empty array when key is missing", () => {
    const result = loadTodos();
    expect(result).toEqual([]);
  });

  it("returns empty array when value is invalid JSON", () => {
    mockStorage[STORAGE_KEY] = "not valid json";
    const result = loadTodos();
    expect(result).toEqual([]);
  });

  it("returns empty array when parsed value is not an array", () => {
    mockStorage[STORAGE_KEY] = JSON.stringify({ id: "1" });
    const result = loadTodos();
    expect(result).toEqual([]);
  });
});
