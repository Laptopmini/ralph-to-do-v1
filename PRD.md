# PRD: Todo Logic & Data Layer

## Objective

Create a pure TypeScript module at `src/todo.ts` that defines the `Todo` data type and implements all CRUD operations along with LocalStorage read/write helpers. This module must have no DOM dependencies so that it can be unit-tested directly with Jest.

## Context

The project is a static vanilla HTML/CSS/TypeScript site served by `serve` on port 3000. There is no framework — the browser loads compiled `.js` files from the `src/` directory. Jest unit tests live in `tests/unit/` and match `*.test.ts`; TypeScript is compiled via SWC for Jest. All application logic must be kept in pure TypeScript modules that are separately importable by Jest — DOM wiring lives in a separate `src/app.ts` file that this ticket does not touch. LocalStorage is the sole persistence layer; the agreed key is `"todos"` storing a JSON-serialized array of `Todo` objects. Callers of the CRUD functions are responsible for calling `saveTodos` after mutations — the CRUD functions themselves must not call `saveTodos` internally.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define the Todo interface and storage key constant. Create `src/todo.ts` and add: an exported `interface Todo` with fields `id: string`, `text: string`, and `completed: boolean`; and an exported constant `STORAGE_KEY = "todos"` that will be used by all LocalStorage operations in this file. `[test: npx jest tests/unit/define-todo-interface.test.ts]`
- [ ] Implement and export loadTodos. In `src/todo.ts`, add an exported function `loadTodos(): Todo[]` that reads the value stored at `localStorage.getItem("todos")`, attempts to parse it as JSON, and returns the resulting array. If the key is missing (returns `null`), the value cannot be parsed as JSON (throws), or the parsed value is not an array (`!Array.isArray(...)`), the function must return an empty array `[]` without throwing. `[test: npx jest tests/unit/implement-export-loadtodos.test.ts]`
- [ ] Implement and export saveTodos. In `src/todo.ts`, add an exported function `saveTodos(todos: Todo[]): void` that serializes the given array to a JSON string with `JSON.stringify(todos)` and writes it to `localStorage` under the key `"todos"`. The function returns nothing. `[test: npx jest tests/unit/implement-export-savetodos.test.ts]`
- [ ] Implement and export addTodo. In `src/todo.ts`, add an exported function `addTodo(todos: Todo[], text: string): Todo[]` that: if `text.trim()` is empty, returns the original array unchanged; otherwise creates a new `Todo` with `id` set to `crypto.randomUUID()`, `text` set to `text.trim()`, and `completed` set to `false`, then prepends it to a copy of the array and returns the new array. This function must not call `saveTodos`. `[test: npx jest tests/unit/implement-export-addtodo.test.ts]`
- [ ] Implement and export toggleTodo. In `src/todo.ts`, add an exported function `toggleTodo(todos: Todo[], id: string): Todo[]` that returns a new array where the `Todo` item whose `id` matches the given `id` has its `completed` field flipped (`true` → `false`, `false` → `true`). All other items are returned unchanged. If no item matches the given `id`, return the original array unchanged. This function must not call `saveTodos`. `[test: npx jest tests/unit/implement-export-toggletodo.test.ts]`
- [ ] Implement and export deleteTodo. In `src/todo.ts`, add an exported function `deleteTodo(todos: Todo[], id: string): Todo[]` that returns a new array with the `Todo` item whose `id` matches the given `id` removed. If no item matches, return the original array unchanged. This function must not call `saveTodos`. `[test: npx jest tests/unit/implement-export-deletetodo.test.ts]`
