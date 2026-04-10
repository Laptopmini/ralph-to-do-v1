# PRD: Todo Logic & Data Layer

## Objective

Create a pure TypeScript module for to-do CRUD operations with LocalStorage persistence that can be unit-tested independently of the DOM.

## Context

This project is a static HTML/CSS/TypeScript site served by `serve` (no JavaScript framework). The existing "Hello World" placeholder page will be fully replaced by this to-do list application. The implementation follows a two-file architecture: a pure logic module (`src/todo.ts`) that handles data operations, and a DOM wiring module (`src/app.ts`) that connects the UI to the logic.

The app uses LocalStorage with the key `"todos"` to persist to-do items as JSON-serialized arrays. Each to-do item has a unique ID (generated via `crypto.randomUUID()`), text description, and completed boolean flag.

Existing patterns in this repo:
- Single-page app structure in `src/` directory with TypeScript files
- Jest unit tests in `tests/unit/` compiled via SWC
- Playwright E2E tests in `tests/e2e/` using ts-node

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and STORAGE_KEY constant. Create src/todo.ts with exported Todo interface containing id (string), text (string), completed (boolean) fields, and export a constant STORAGE_KEY = "todos" used for all LocalStorage operations. `[test: npx jest tests/unit/define-todo-interface-storage-key-constant.test.ts]`
- [ ] Implement loadTodos function. Create exported function `loadTodos(): Todo[]` that reads the "todos" key from localStorage, parses it as JSON, and returns the array. If the key is missing, the value is not valid JSON, or the parsed value is not an array, return an empty array []. `[test: npx jest tests/unit/implement-loadtodos-function.test.ts]`
- [ ] Implement saveTodos function. Create exported function `saveTodos(todos: Todo[]): void` that serializes the given array to JSON and writes it to localStorage under the "todos" key. `[test: npx jest tests/unit/implement-saveTodos-function.test.ts]`
- [ ] Implement addTodo function. Create exported function `addTodo(todos: Todo[], text: string): Todo[]` that checks if text.trim() is empty (return array unchanged if so), otherwise creates a new Todo with id from crypto.randomUUID(), trimmed text, and completed = false, prepends it to the array, and returns the new array. Does not call saveTodos. `[test: npx jest tests/unit/implement-addtodo-function.test.ts]`
- [ ] Implement toggleTodo function. Create exported function `toggleTodo(todos: Todo[], id: string): Todo[]` that returns a new array where the item matching id has its completed boolean flipped. If no item matches, return the array unchanged. Does not call saveTodos. `[test: npx jest tests/unit/implement-toggletodo-function.test.ts]`
- [ ] Implement deleteTodo function. Create exported function `deleteTodo(todos: Todo[], id: string): Todo[]` that returns a new array with the item matching id removed. If no item matches, return the array unchanged. Does not call saveTodos. `[test: npx jest tests/unit/implement-deletetodo-function.test.ts]`
