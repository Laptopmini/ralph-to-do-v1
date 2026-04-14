# PRD: Todo Logic Data Layer

## Objective

Implement a pure TypeScript module for CRUD operations and LocalStorage persistence of to-do items, providing load, save, add, toggle, and delete functions that can be unit-tested with Jest.

## Context

The project is a static HTML/CSS/TypeScript application served by `serve` with no JavaScript framework. Each to-do item has a unique ID (generated via `crypto.randomUUID()`), a text description, and a completed boolean. LocalStorage key will be `"todos"` storing a JSON-serialized array of to-do items. This ticket establishes the data layer that the UI will consume without any DOM dependencies.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and storage constant. Create `src/todo.ts` with exported `Todo` interface containing `id` (string), `text` (string), `completed` (boolean) and export `STORAGE_KEY = "todos"` for LocalStorage operations. `[test: npx jest tests/unit/define-todo-interface-storage-constant.test.ts]`
- [ ] Implement load todos function. Create `loadTodos(): Todo[]` that reads the `"todos"` key from `localStorage`, parses as JSON, and returns the array; if missing, invalid JSON, or not an array, return empty array `[]`. `[test: npx jest tests/unit/implement-load-todos-function.test.ts]`
- [ ] Implement save todos function. Create `saveTodos(todos: Todo[]): void` that serializes the given array to JSON and writes it to `localStorage` under the `"todos"` key. `[test: npx jest tests/unit/implement-save-todos-function.test.ts]`
- [ ] Implement add todo function. Create `addTodo(todos: Todo[], text: string): Todo[]` that returns unchanged if `text.trim()` is empty; otherwise creates new Todo with `id` from `crypto.randomUUID()`, trimmed `text`, and `completed = false`, prepends it to array and returns new array without calling saveTodos. `[test: npx jest tests/unit/implement-add-todo-function.test.ts]`
- [ ] Implement toggle todo function. Create `toggleTodo(todos: Todo[], id: string): Todo[]` that returns new array with matching item's `completed` boolean flipped; if no match, return unchanged without calling saveTodos. `[test: npx jest tests/unit/implement-toggle-todo-function.test.ts]`
- [ ] Implement delete todo function. Create `deleteTodo(todos: Todo[], id: string): Todo[]` that returns new array with matching item removed; if no match, return unchanged without calling saveTodos. `[test: npx jest tests/unit/implement-delete-todo-function.test.ts]`
