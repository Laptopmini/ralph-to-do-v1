import { loadTodos, STORAGE_KEY } from "../../src/todo";

const mockStorage: Record<string, string> = {};

beforeEach(() => {
  for (const key of Object.keys(mockStorage)) {
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
    const todos = [
      { id: "1", text: "Buy milk", completed: false },
      { id: "2", text: "Walk dog", completed: true },
    ];
    mockStorage[STORAGE_KEY] = JSON.stringify(todos);

    const result = loadTodos();
    expect(result).toEqual(todos);
  });

  it("returns empty array when key is missing", () => {
    const result = loadTodos();
    expect(result).toEqual([]);
  });

  it("returns empty array when value is not valid JSON", () => {
    mockStorage[STORAGE_KEY] = "not-json{{{";
    const result = loadTodos();
    expect(result).toEqual([]);
  });

  it("returns empty array when parsed value is not an array", () => {
    mockStorage[STORAGE_KEY] = JSON.stringify({ key: "value" });
    const result = loadTodos();
    expect(result).toEqual([]);
  });
});
