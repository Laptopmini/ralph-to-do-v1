# PRD: Todo Logic Data Layer

## Objective

Implement a pure TypeScript module for to-do CRUD operations with LocalStorage persistence, providing loadTodos, saveTodos, addTodo, toggleTodo, and deleteTodo functions that can be unit-tested independently of the DOM.

## Context

The project is a static HTML/CSS/TypeScript application served by `serve` without any JavaScript framework. Each to-do item has a unique ID (generated via `crypto.randomUUID()`), a text description, and a completed boolean. LocalStorage will store to-do data under the key `"todos"` as a JSON-serialized array. This ticket establishes the foundational data layer that other components will depend on.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define and export Todo interface and STORAGE_KEY constant. Create `src/todo.ts` with exported `Todo` interface containing fields: `id` (string), `text` (string), `completed` (boolean), and exported constant `STORAGE_KEY = "todos"`. `[test: npx jest tests/unit/define-todo-interface-storage-key.test.ts]`
- [ ] Implement loadTodos function. Create and export `loadTodos(): Todo[]` that reads the `"todos"` key from `localStorage`, parses it as JSON, and returns the array; if the key is missing, value is not valid JSON, or parsed value is not an array, return empty array `[]`. `[test: npx jest tests/unit/implement-load-todos-function.test.ts]`
- [ ] Implement saveTodos function. Create and export `saveTodos(todos: Todo[]): void` that serializes the given array to JSON and writes it to `localStorage` under the `"todos"` key. `[test: npx jest tests/unit/implement-save-todos-function.test.ts]`
- [ ] Implement addTodo function. Create and export `addTodo(todos: Todo[], text: string): Todo[]` that returns the array unchanged if `text.trim()` is empty; otherwise creates a new `Todo` with `id` from `crypto.randomUUID()`, trimmed `text`, and `completed` set to `false`, prepends it to the array, and returns the new array without calling `saveTodos`. `[test: npx jest tests/unit/implement-add-todo-function.test.ts]`
- [ ] Implement toggleTodo function. Create and export `toggleTodo(todos: Todo[], id: string): Todo[]` that returns a new array where the item matching `id` has its `completed` boolean flipped; if no item matches, return the array unchanged without calling `saveTodos`. `[test: npx jest tests/unit/implement-toggle-todo-function.test.ts]`
- [ ] Implement deleteTodo function. Create and export `deleteTodo(todos: Todo[], id: string): Todo[]` that returns a new array with the item matching `id` removed; if no item matches, return the array unchanged without calling `saveTodos`. `[test: npx jest tests/unit/implement-delete-todo-function.test.ts]`
