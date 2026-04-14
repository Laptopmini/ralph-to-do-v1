import type { Todo } from "../../src/todo.js";
import { loadTodos, STORAGE_KEY } from "../../src/todo.js";

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
  it("returns an empty array when localStorage has no todos key", () => {
    const result = loadTodos();
    expect(result).toEqual([]);
  });

  it("returns parsed todos when localStorage contains valid JSON array", () => {
    const todos: Todo[] = [{ id: "1", text: "Test todo", completed: false }];
    mockStorage[STORAGE_KEY] = JSON.stringify(todos);

    const result = loadTodos();
    expect(result).toEqual(todos);
  });

  it("returns an empty array when localStorage contains invalid JSON", () => {
    mockStorage[STORAGE_KEY] = "not valid json";

    const result = loadTodos();
    expect(result).toEqual([]);
  });

  it("returns an empty array when localStorage contains a non-array JSON value", () => {
    mockStorage[STORAGE_KEY] = JSON.stringify({ id: "1" });

    const result = loadTodos();
    expect(result).toEqual([]);
  });
});
