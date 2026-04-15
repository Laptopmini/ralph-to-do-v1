import { loadTodos, STORAGE_KEY } from "../../src/todo.js";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

describe("loadTodos", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("returns an empty array when localStorage has no todos key", () => {
    const result = loadTodos();
    expect(result).toEqual([]);
  });

  it("returns parsed todos from localStorage", () => {
    const todos = [
      { id: "1", text: "Test", completed: false },
      { id: "2", text: "Done", completed: true },
    ];
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(todos));
    const result = loadTodos();
    expect(result).toEqual(todos);
  });

  it("returns empty array for invalid JSON", () => {
    localStorageMock.setItem(STORAGE_KEY, "not-valid-json{{{");
    const result = loadTodos();
    expect(result).toEqual([]);
  });

  it("returns empty array when stored value is not an array", () => {
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify({ id: "1" }));
    const result = loadTodos();
    expect(result).toEqual([]);
  });
});
