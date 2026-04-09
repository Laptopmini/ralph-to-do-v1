# PRD: Todo Logic & Data Layer

## Objective

Create a pure TypeScript module that handles CRUD operations and LocalStorage persistence for to-do items. This module will be the data layer for the to-do list application, providing all the core functionality for managing to-do items without any DOM or browser API dependencies.

## Context

The existing "Hello World" placeholder page will be replaced by a full to-do list application. The app is a static vanilla HTML/CSS/JavaScript site served by `serve` — no JavaScript framework like React or Vue will be introduced. The implementation plan uses a detected stack of static HTML/CSS/TypeScript with the following patterns:

- Single-page app structure in `src/` directory
- `serve -s src -l 3000` serves the `src/` directory statically on port 3000
- Jest unit tests located in `tests/unit/` matching `*.test.ts` files
- Playwright E2E tests located in `tests/e2e/` matching `*.spec.ts` files

Each to-do item will have a unique ID (generated via `crypto.randomUUID()`), a text description, and a completed boolean. LocalStorage key will be `"todos"` storing a JSON-serialized array of to-do items. No authentication or server-side persistence is needed — all data lives in the browser's LocalStorage.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and STORAGE_KEY constant. Create src/todo.ts file with exported Todo interface containing id (string), text (string), completed (boolean) fields, and export a constant STORAGE_KEY = "todos" used for all LocalStorage operations. `[test: npx jest tests/unit/define-todo-interface-storage-key.test.ts]`
- [ ] Implement loadTodos function. Create loadTodos(): Todo[] function that reads the "todos" key from localStorage, parses it as JSON, and returns the array. If the key is missing, the value is not valid JSON, or the parsed value is not an array, return an empty array []. `[test: npx jest tests/unit/implement-load-todos-function.test.ts]`
- [ ] Implement saveTodos function. Create saveTodos(todos: Todo[]): void function that serializes the given array to JSON and writes it to localStorage under the "todos" key. `[test: npx jest tests/unit/implement-save-todos-function.test.ts]`
- [ ] Implement addTodo function. Create addTodo(todos: Todo[], text: string): Todo[] function that if text.trim() is empty returns the array unchanged, otherwise creates a new Todo with id set to crypto.randomUUID(), text set to the trimmed input, and completed set to false, prepends the new item to the array and returns it. Does not call saveTodos (caller is responsible for persistence). `[test: npx jest tests/unit/implement-add-todo-function.test.ts]`
- [ ] Implement toggleTodo function. Create toggleTodo(todos: Todo[], id: string): Todo[] function that returns a new array where the item matching id has its completed boolean flipped. If no item matches, return the array unchanged. Does not call saveTodos. `[test: npx jest tests/unit/implement-toggle-todo-function.test.ts]`
- [ ] Implement deleteTodo function. Create deleteTodo(todos: Todo[], id: string): Todo[] function that returns a new array with the item matching id removed. If no item matches, return the array unchanged. Does not call saveTodos. `[test: npx jest tests/unit/implement-delete-todo-function.test.ts]`
