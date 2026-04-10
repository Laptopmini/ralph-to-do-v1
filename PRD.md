# PRD: Todo Logic & Data Layer

## Objective

Create a pure TypeScript module handling CRUD operations and LocalStorage persistence for to-do items. This module provides the data layer that will be used by the UI component in subsequent tickets.

## Context

The existing "Hello World" placeholder page will be replaced with a full to-do list application. The app remains a static vanilla HTML/CSS/JS site served by `serve` — no JavaScript framework like React or Vue will be introduced.

**Existing patterns:**
- Single-page app structure in `src/` directory with `index.html`, `style.css`, and TypeScript files
- `serve -s src -l 3000` serves the `src/` directory statically on port 3000
- Jest unit tests live in `tests/unit/` matching `*.test.ts` pattern
- Playwright E2E tests live in `tests/e2e/` matching `*.spec.ts` pattern

**Data model:**
- Each to-do item has: a unique ID (via `crypto.randomUUID()`), text description, and completed boolean flag
- LocalStorage key is `"todos"` storing a JSON-serialized array of todo items
- No authentication or server-side persistence needed — all data lives in browser LocalStorage

This ticket focuses solely on the pure logic layer (`src/todo.ts`) with no DOM dependencies. The UI wiring will be handled in a separate ticket.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [x] Define Todo interface and STORAGE_KEY constant. Create src/todo.ts with exported Todo type (id: string, text: string, completed: boolean) and export const STORAGE_KEY = "todos". `[test: npx jest tests/unit/define-todo-interface-storage-key.test.ts]`
- [ ] Implement loadTodos function. Create loadTodos(): Todo[] — reads the "todos" key from localStorage, parses as JSON, returns the array; if missing, invalid JSON, or non-array value, return empty array []. `[test: npx jest tests/unit/implement-load-todos.test.ts]`
- [ ] Implement saveTodos function. Create saveTodos(todos: Todo[]): void — serializes the given array to JSON and writes it to localStorage under the "todos" key. `[test: npx jest tests/unit/implement-save-todos.test.ts]`
- [ ] Implement addTodo function. Create addTodo(todos: Todo[], text: string): Todo[] — if text.trim() is empty, return array unchanged; otherwise create new Todo with id=crypto.randomUUID(), text=trimmed input, completed=false; prepend to array and return new array (does not call saveTodos). `[test: npx jest tests/unit/implement-add-todo.test.ts]`
- [ ] Implement toggleTodo function. Create toggleTodo(todos: Todo[], id: string): Todo[] — return new array where item matching id has completed boolean flipped; if no match, return array unchanged (does not call saveTodos). `[test: npx jest tests/unit/implement-toggle-todo.test.ts]`
- [ ] Implement deleteTodo function. Create deleteTodo(todos: Todo[], id: string): Todo[] — return new array with item matching id removed; if no match, return array unchanged (does not call saveTodos). `[test: npx jest tests/unit/implement-delete-todo.test.ts]`
