import type { Todo } from "../../src/todo.js";
import { STORAGE_KEY, saveTodos } from "../../src/todo.js";

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

describe("saveTodos", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("serializes todos to JSON and stores under STORAGE_KEY", () => {
    const todos: Todo[] = [{ id: "1", text: "Buy milk", completed: false }];
    saveTodos(todos);
    const stored = localStorageMock.getItem(STORAGE_KEY);
    expect(stored).toBe(JSON.stringify(todos));
  });

  it("stores an empty array when given no todos", () => {
    saveTodos([]);
    const stored = localStorageMock.getItem(STORAGE_KEY);
    expect(stored).toBe("[]");
  });
});
