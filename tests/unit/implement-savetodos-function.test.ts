import type { Todo } from "../../src/todo.js";
import { STORAGE_KEY, saveTodos } from "../../src/todo.js";

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

describe("saveTodos", () => {
  it("serializes todos to JSON and stores under the todos key", () => {
    const todos: Todo[] = [{ id: "1", text: "Buy milk", completed: false }];

    saveTodos(todos);

    const stored = mockStorage[STORAGE_KEY];
    expect(stored).toBeDefined();
    expect(JSON.parse(stored)).toEqual(todos);
  });

  it("stores an empty array when given an empty array", () => {
    saveTodos([]);

    const stored = mockStorage[STORAGE_KEY];
    expect(stored).toBeDefined();
    expect(JSON.parse(stored)).toEqual([]);
  });
});
