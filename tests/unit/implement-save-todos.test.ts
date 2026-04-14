import type { Todo } from "../../src/todo.ts";
import { STORAGE_KEY, saveTodos } from "../../src/todo.ts";

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
  it("serializes todos to JSON and writes to localStorage", () => {
    const todos: Todo[] = [
      { id: "1", text: "First", completed: false },
      { id: "2", text: "Second", completed: true },
    ];

    saveTodos(todos);

    const stored = mockStorage[STORAGE_KEY];
    expect(stored).toBeDefined();
    expect(JSON.parse(stored)).toEqual(todos);
  });

  it("writes an empty array when given no todos", () => {
    saveTodos([]);

    const stored = mockStorage[STORAGE_KEY];
    expect(stored).toBeDefined();
    expect(JSON.parse(stored)).toEqual([]);
  });
});
