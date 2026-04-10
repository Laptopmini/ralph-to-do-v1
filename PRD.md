# PRD: Todo Logic & Data Layer

## Objective

Create a pure TypeScript module handling CRUD operations and LocalStorage persistence for to-do items. This module will provide the data layer that the UI can consume.

## Context

- The existing "Hello World" placeholder page will be fully replaced by the to-do list application
- No JavaScript framework (React, Vue, etc.) will be introduced — the app remains a static vanilla HTML/CSS/JS site served by `serve`
- Each to-do item has: a unique ID (`crypto.randomUUID()`), a text description, and a completed boolean
- LocalStorage key is `"todos"` storing a JSON-serialized array of to-do items
- The module must be pure (no DOM dependencies) so it can be unit-tested with Jest
- Existing patterns use `tests/unit/` for Jest unit tests matching `*.test.ts`

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and STORAGE_KEY constant. Create `src/todo.ts` with exported `Todo` interface containing fields: `id` (string), `text` (string), `completed` (boolean). Also export constant `STORAGE_KEY = "todos"` used for all LocalStorage operations. `[test: npx jest tests/unit/define-todo-interface-storage-key.test.ts]`

- [ ] Implement loadTodos function. Create and export `loadTodos(): Todo[]` — reads the `"todos"` key from `localStorage`, parses it as JSON, and returns the array. If the key is missing, the value is not valid JSON, or the parsed value is not an array, return an empty array `[]`. `[test: npx jest tests/unit/implement-load-todos-function.test.ts]`

- [ ] Implement saveTodos function. Create and export `saveTodos(todos: Todo[]): void` — serializes the given array to JSON and writes it to `localStorage` under the `"todos"` key. `[test: npx jest tests/unit/implement-save-todos-function.test.ts]`

- [ ] Implement addTodo function. Create and export `addTodo(todos: Todo[], text: string): Todo[]` — if `text.trim()` is empty, return the array unchanged. Otherwise, create a new `Todo` with `id` set to `crypto.randomUUID()`, `text` set to the trimmed input, and `completed` set to `false`. Prepend the new item to the array and return the new array. Does not call `saveTodos` (caller is responsible for persistence). `[test: npx jest tests/unit/implement-add-todo-function.test.ts]`

- [ ] Implement toggleTodo function. Create and export `toggleTodo(todos: Todo[], id: string): Todo[]` — return a new array where the item matching `id` has its `completed` boolean flipped. If no item matches, return the array unchanged. Does not call `saveTodos`. `[test: npx jest tests/unit/implement-toggle-todo-function.test.ts]`

- [ ] Implement deleteTodo function. Create and export `deleteTodo(todos: Todo[], id: string): Todo[]` — return a new array with the item matching `id` removed. If no item matches, return the array unchanged. Does not call `saveTodos`. `[test: npx jest tests/unit/implement-delete-todo-function.test.ts]`
