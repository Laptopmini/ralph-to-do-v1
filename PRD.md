# PRD: Todo Logic & Data Layer

## Objective

Create a pure TypeScript module that handles CRUD operations and LocalStorage persistence for to-do items. This module will provide the data layer for the to-do list application, enabling add, toggle completion status, delete, load, and save operations without any DOM dependencies.

## Context

This project is a static HTML/CSS/TypeScript site served by `serve` with no JavaScript framework. The existing "Hello World" placeholder page will be fully replaced by this to-do list application. TypeScript needs to be compiled to JavaScript for browser consumption since `serve` only serves static files.

The architecture uses a pure TypeScript module pattern:
- `src/todo.ts` — contains all logic and data operations (pure functions, no DOM)
- `src/app.ts` — will handle DOM wiring separately

For testing:
- Jest unit tests in `tests/unit/` for the pure logic module
- Playwright E2E tests in `tests/e2e/` for UI interactions (created later)

The app uses LocalStorage with key `"todos"` to persist data, storing a JSON-serialized array of todo items. Each item has: a unique ID (via `crypto.randomUUID()`), text description, and completed boolean.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and STORAGE_KEY constant. Create src/todo.ts with exported type Todo having fields id (string), text (string), completed (boolean) and export const STORAGE_KEY = "todos" used for all LocalStorage operations. `[test: npx jest tests/unit/define-todo-interface-storage-key.test.ts]`
- [ ] Implement loadTodos function. Create and export function loadTodos(): Todo[] that reads the "todos" key from localStorage, parses it as JSON, and returns the array. If the key is missing, the value is not valid JSON, or the parsed value is not an array, return an empty array []. `[test: npx jest tests/unit/implement-load-todos-function.test.ts]`
- [ ] Implement saveTodos function. Create and export function saveTodos(todos: Todo[]): void that serializes the given array to JSON and writes it to localStorage under the "todos" key. `[test: npx jest tests/unit/implement-save-todos-function.test.ts]`
- [ ] Implement addTodo function. Create and export function addTodo(todos: Todo[], text: string): Todo[] that if text.trim() is empty returns the array unchanged, otherwise creates a new Todo with id set to crypto.randomUUID(), text set to the trimmed input, and completed set to false, prepends the new item to the array and returns it. Does not call saveTodos. `[test: npx jest tests/unit/implement-add-todo-function.test.ts]`
- [ ] Implement toggleTodo function. Create and export function toggleTodo(todos: Todo[], id: string): Todo[] that returns a new array where the item matching id has its completed boolean flipped. If no item matches, return the array unchanged. Does not call saveTodos. `[test: npx jest tests/unit/implement-toggle-todo-function.test.ts]`
- [ ] Implement deleteTodo function. Create and export function deleteTodo(todos: Todo[], id: string): Todo[] that returns a new array with the item matching id removed. If no item matches, return the array unchanged. Does not call saveTodos. `[test: npx jest tests/unit/implement-delete-todo-function.test.ts]`
