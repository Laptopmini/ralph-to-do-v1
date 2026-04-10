import type { Todo } from "../../src/todo";
import { STORAGE_KEY, saveTodos } from "../../src/todo";

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
  test("serializes todos to localStorage under STORAGE_KEY", () => {
    const todos: Todo[] = [
      { id: "1", text: "Buy milk", completed: false },
      { id: "2", text: "Walk dog", completed: true },
    ];

    saveTodos(todos);

    const stored = mockStorage[STORAGE_KEY];
    expect(stored).toBeDefined();
    expect(JSON.parse(stored)).toEqual(todos);
  });

  test("saves empty array correctly", () => {
    saveTodos([]);

    const stored = mockStorage[STORAGE_KEY];
    expect(stored).toBeDefined();
    expect(JSON.parse(stored)).toEqual([]);
  });
});
