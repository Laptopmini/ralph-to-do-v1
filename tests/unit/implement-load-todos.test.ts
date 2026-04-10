import type { Todo } from "../../src/todo";
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
  test("returns stored todos when valid JSON array exists", () => {
    const stored: Todo[] = [{ id: "1", text: "Test", completed: false }];
    mockStorage[STORAGE_KEY] = JSON.stringify(stored);

    const result = loadTodos();
    expect(result).toEqual(stored);
  });

  test("returns empty array when key is missing", () => {
    const result = loadTodos();
    expect(result).toEqual([]);
  });

  test("returns empty array for invalid JSON", () => {
    mockStorage[STORAGE_KEY] = "not valid json{";
    const result = loadTodos();
    expect(result).toEqual([]);
  });

  test("returns empty array when stored value is not an array", () => {
    mockStorage[STORAGE_KEY] = JSON.stringify({ key: "value" });
    const result = loadTodos();
    expect(result).toEqual([]);
  });
});
