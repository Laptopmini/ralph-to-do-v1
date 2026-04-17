// @ts-nocheck
import { loadTodos, saveTodos } from "../../src/storage";

function makeStorage() {
  const store: Record<string, string> = {};
  return {
    getItem: jest.fn((k: string) => (k in store ? store[k] : null)),
    setItem: jest.fn((k: string, v: string) => {
      store[k] = v;
    }),
    removeItem: jest.fn((k: string) => {
      delete store[k];
    }),
    clear: jest.fn(() => {
      for (const k of Object.keys(store)) delete store[k];
    }),
    _store: store,
  };
}

describe("storage module", () => {
  let storage: ReturnType<typeof makeStorage>;

  beforeEach(() => {
    storage = makeStorage();
    // @ts-expect-error
    global.window = { localStorage: storage };
  });

  afterEach(() => {
    // @ts-expect-error
    delete global.window;
  });

  describe("loadTodos", () => {
    it("returns empty array when key missing", () => {
      expect(loadTodos()).toEqual([]);
    });

    it("returns parsed array when valid", () => {
      const todos = [
        { id: "a", text: "hi", completed: false, createdAt: 1 },
        { id: "b", text: "bye", completed: true, createdAt: 2 },
      ];
      storage._store["todos-v1"] = JSON.stringify(todos);
      expect(loadTodos()).toEqual(todos);
    });

    it("returns empty array when JSON invalid", () => {
      storage._store["todos-v1"] = "{not json";
      expect(loadTodos()).toEqual([]);
    });

    it("returns empty array when parsed value is not an array", () => {
      storage._store["todos-v1"] = JSON.stringify({ foo: "bar" });
      expect(loadTodos()).toEqual([]);
    });

    it("drops malformed entries", () => {
      const valid = { id: "a", text: "hi", completed: false, createdAt: 1 };
      const malformed = [
        valid,
        { id: 1, text: "x", completed: false, createdAt: 1 }, // id not string
        { id: "b", text: 2, completed: false, createdAt: 1 }, // text not string
        { id: "c", text: "x", completed: "no", createdAt: 1 }, // completed not boolean
        { id: "d", text: "x", completed: false, createdAt: "1" }, // createdAt not number
        null,
        "nope",
      ];
      storage._store["todos-v1"] = JSON.stringify(malformed);
      expect(loadTodos()).toEqual([valid]);
    });
  });

  describe("saveTodos", () => {
    it("writes JSON to todos-v1", () => {
      const todos = [{ id: "a", text: "hi", completed: false, createdAt: 1 }];
      saveTodos(todos);
      expect(storage.setItem).toHaveBeenCalledWith("todos-v1", JSON.stringify(todos));
    });

    it("swallows QuotaExceededError silently", () => {
      storage.setItem.mockImplementation(() => {
        const err = new Error("quota");
        err.name = "QuotaExceededError";
        throw err;
      });
      expect(() => saveTodos([])).not.toThrow();
    });
  });
});
