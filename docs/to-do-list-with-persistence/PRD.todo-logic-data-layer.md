# PRD: Todo Logic & Data Layer

## Objective

Implement a pure TypeScript module handling CRUD operations and LocalStorage persistence for to-do items, providing loadTodos, saveTodos, addTodo, toggleTodo, and deleteTodo functions that can be unit-tested with Jest.

## Context

The project is a static HTML/CSS/TypeScript site served by `serve` with no JavaScript framework. Each to-do item has a unique ID (generated via `crypto.randomUUID()`), a text description, and a completed boolean. LocalStorage key will be `"todos"` storing a JSON-serialized array of to-do items. This ticket establishes the data layer as a pure module with no DOM dependencies so it can be unit-tested directly with Jest.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [x] Define Todo interface and STORAGE_KEY constant. Create `src/todo.ts` with exported `Todo` interface containing fields: `id` (string), `text` (string), `completed` (boolean), and export constant `STORAGE_KEY = "todos"` for LocalStorage operations. `[test: npx jest tests/unit/define-todo-interface-storage-key.test.ts]`
- [x] Implement loadTodos function. Create exported function `loadTodos(): Todo[]` that reads the `"todos"` key from localStorage, parses it as JSON, and returns the array; if key is missing, value is not valid JSON, or parsed value is not an array, return empty array `[]`. `[test: npx jest tests/unit/implement-loadtodos-function.test.ts]`
- [x] Implement saveTodos function. Create exported function `saveTodos(todos: Todo[]): void` that serializes the given array to JSON and writes it to localStorage under the `"todos"` key. `[test: npx jest tests/unit/implement-savetodos-function.test.ts]`
- [x] Implement addTodo function. Create exported function `addTodo(todos: Todo[], text: string): Todo[]` that returns unchanged if `text.trim()` is empty; otherwise creates new `Todo` with `id` set to `crypto.randomUUID()`, `text` set to trimmed input, and `completed` set to `false`; prepends new item to array and returns it without calling saveTodos. `[test: npx jest tests/unit/implement-addtodo-function.test.ts]`
- [x] Implement toggleTodo function. Create exported function `toggleTodo(todos: Todo[], id: string): Todo[]` that returns new array where item matching `id` has its `completed` boolean flipped; if no item matches, return array unchanged without calling saveTodos. `[test: npx jest tests/unit/implement-toggletodo-function.test.ts]`
- [x] Implement deleteTodo function. Create exported function `deleteTodo(todos: Todo[], id: string): Todo[]` that returns new array with item matching `id` removed; if no item matches, return array unchanged without calling saveTodos. `[test: npx jest tests/unit/implement-deletetodo-function.test.ts]`
