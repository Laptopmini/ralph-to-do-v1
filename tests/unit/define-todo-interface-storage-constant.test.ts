import { STORAGE_KEY } from "../../src/todo.js";

describe("Todo interface and storage constant", () => {
  it("exports STORAGE_KEY as 'todos'", () => {
    expect(STORAGE_KEY).toBe("todos");
  });

  it("STORAGE_KEY is a string", () => {
    expect(typeof STORAGE_KEY).toBe("string");
  });
});
