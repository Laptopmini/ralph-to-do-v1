# PRD: Todo Logic & Data Layer

## Objective

Create a pure TypeScript module at `src/todo.ts` that defines the `Todo` data type and implements all CRUD operations along with LocalStorage persistence. This module must have no DOM dependencies so it can be fully unit-tested with Jest in isolation from the browser environment.

## Context

This project is a static vanilla HTML/CSS/TypeScript app served by `serve` on port 3000. There is no JavaScript framework. TypeScript is compiled via SWC for Jest unit tests, and Playwright is used for E2E tests. All business logic lives in `src/todo.ts` as pure functions so it can be independently tested. The DOM wiring (`src/app.ts`) is handled in a separate ticket.

Each to-do item has three fields: a unique `id` (generated via `crypto.randomUUID()`), a `text` description, and a `completed` boolean. All items are stored as a JSON-serialized array in `localStorage` under the key `"todos"`. Functions do not call `saveTodos` internally — the caller (the app layer) is responsible for persisting after mutations.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and STORAGE_KEY constant. Create `src/todo.ts` and export a TypeScript `interface Todo` with fields `id: string`, `text: string`, and `completed: boolean`. Also export a constant `STORAGE_KEY = "todos"` that will be used by all LocalStorage operations in this module. `[test: npx jest tests/unit/define-todo-interface-storage-key-constant.test.ts]`
- [ ] Implement loadTodos function. In `src/todo.ts`, implement and export `loadTodos(): Todo[]` — reads `localStorage.getItem("todos")`, parses it as JSON, and returns the resulting array. If the key is missing, the stored value is not valid JSON, or the parsed result is not an array, return an empty array `[]`. `[test: npx jest tests/unit/implement-loadtodos-function.test.ts]`
- [ ] Implement saveTodos function. In `src/todo.ts`, implement and export `saveTodos(todos: Todo[]): void` — calls `JSON.stringify(todos)` and writes the result to `localStorage` under the key `"todos"` via `localStorage.setItem`. `[test: npx jest tests/unit/implement-savetodos-function.test.ts]`
- [ ] Implement addTodo function. In `src/todo.ts`, implement and export `addTodo(todos: Todo[], text: string): Todo[]` — if `text.trim()` is empty, return the original array unchanged. Otherwise, create a new `Todo` object with `id` set to `crypto.randomUUID()`, `text` set to the trimmed input, and `completed` set to `false`. Prepend the new item to the front of the array and return the new array. This function must not call `saveTodos`. `[test: npx jest tests/unit/implement-addtodo-function.test.ts]`
- [ ] Implement toggleTodo function. In `src/todo.ts`, implement and export `toggleTodo(todos: Todo[], id: string): Todo[]` — return a new array where the item whose `id` matches the given `id` has its `completed` boolean flipped (true→false, false→true). All other items remain unchanged. If no item matches the given `id`, return the original array unchanged. This function must not call `saveTodos`. `[test: npx jest tests/unit/implement-toggletodo-function.test.ts]`
- [ ] Implement deleteTodo function. In `src/todo.ts`, implement and export `deleteTodo(todos: Todo[], id: string): Todo[]` — return a new array with the item whose `id` matches the given `id` removed. If no item matches, return the original array unchanged. This function must not call `saveTodos`. `[test: npx jest tests/unit/implement-deletetodo-function.test.ts]`
