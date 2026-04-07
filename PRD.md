# PRD: Todo Logic & Data Layer

## Objective

Create `src/todo.ts`, a pure TypeScript module that defines the `Todo` data type and implements all CRUD operations plus LocalStorage persistence. This module has no DOM dependencies and can be unit-tested directly with Jest.

## Context

This project is a static vanilla HTML/CSS/TypeScript to-do list app served by `serve -s src -l 3000`. There is no frontend framework. Unit tests live in `tests/unit/` and are run with Jest + SWC. All logic should be kept in a pure module (`src/todo.ts`) so it can be imported and tested without a browser environment.

Each to-do item has three fields: a unique `id` (generated via `crypto.randomUUID()`), a `text` description, and a `completed` boolean. LocalStorage is used for persistence under the key `"todos"` (a JSON-serialized array).

The functions in this module are intentionally pure — they receive the current todos array as input and return a new array as output. They do **not** call `saveTodos` internally; the caller (the app layer) is responsible for persistence after each mutation.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and STORAGE_KEY constant. Create `src/todo.ts`. Export the `Todo` interface with fields: `id: string`, `text: string`, `completed: boolean`. Also export a constant `STORAGE_KEY = "todos"` (type `string`) that will be used by all LocalStorage operations in this file. `[test: npx jest tests/unit/define-todo-interface-storage-key.test.ts]`
- [ ] Implement loadTodos function. In `src/todo.ts`, implement and export `loadTodos(): Todo[]`. It must: call `localStorage.getItem(STORAGE_KEY)`, parse the result as JSON, and return the array. If the key is missing (`null`), the value is not valid JSON, or the parsed value is not an array (`!Array.isArray(...)`), return an empty array `[]` instead of throwing. `[test: npx jest tests/unit/implement-loadtodos-function.test.ts]`
- [ ] Implement saveTodos function. In `src/todo.ts`, implement and export `saveTodos(todos: Todo[]): void`. It must call `localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))`. No return value. `[test: npx jest tests/unit/implement-savetodos-function.test.ts]`
- [ ] Implement addTodo function. In `src/todo.ts`, implement and export `addTodo(todos: Todo[], text: string): Todo[]`. Behavior: if `text.trim()` is empty, return the original `todos` array unchanged. Otherwise, create a new `Todo` object with `id` set to `crypto.randomUUID()`, `text` set to `text.trim()`, and `completed` set to `false`. Return a new array with the new todo **prepended** (i.e., `[newTodo, ...todos]`). Do not call `saveTodos`. `[test: npx jest tests/unit/implement-addtodo-function.test.ts]`
- [ ] Implement toggleTodo function. In `src/todo.ts`, implement and export `toggleTodo(todos: Todo[], id: string): Todo[]`. Return a new array where the item whose `id` matches the given `id` has its `completed` field flipped (`!todo.completed`). All other items are unchanged. If no item matches, return the original array unchanged. Do not call `saveTodos`. `[test: npx jest tests/unit/implement-toggletodo-function.test.ts]`
- [ ] Implement deleteTodo function. In `src/todo.ts`, implement and export `deleteTodo(todos: Todo[], id: string): Todo[]`. Return a new array with the item whose `id` matches the given `id` removed. If no item matches, return the original array unchanged. Do not call `saveTodos`. `[test: npx jest tests/unit/implement-deletetodo-function.test.ts]`
