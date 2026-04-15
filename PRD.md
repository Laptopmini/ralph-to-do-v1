# PRD: Todo Logic & Data Layer

## Objective

Implement a pure TypeScript module handling CRUD operations and LocalStorage persistence for to-do items, providing loadTodos, saveTodos, addTodo, toggleTodo, and deleteTodo functions that can be unit-tested with Jest.

## Context

The project uses static HTML/CSS/TypeScript served by `serve` without any JavaScript framework. Each to-do item has a unique ID (generated via `crypto.randomUUID()`), text description, and completed boolean. LocalStorage will use the key `"todos"` for persistence. This ticket establishes the core data layer that other components will depend on.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and storage constant. Create `src/todo.ts` with exported `Todo` interface containing `id` (string), `text` (string), `completed` (boolean) fields, and export constant `STORAGE_KEY = "todos"` for LocalStorage operations. `[test: npx jest tests/unit/define-todo-interface-storage-constant.test.ts]`
- [ ] Implement load todos function. Create `loadTodos(): Todo[]` that reads the `"todos"` key from localStorage, parses it as JSON, and returns the array; if missing, invalid JSON, or not an array, return empty array `[]`. `[test: npx jest tests/unit/implement-load-todos-function.test.ts]`
- [ ] Implement save todos function. Create `saveTodos(todos: Todo[]): void` that serializes the given array to JSON and writes it to localStorage under the `"todos"` key. `[test: npx jest tests/unit/implement-save-todos-function.test.ts]`
- [ ] Implement add todo function. Create `addTodo(todos: Todo[], text: string): Todo[]` that returns unchanged if text is empty after trim, otherwise creates new Todo with unique ID from crypto.randomUUID(), trimmed text, and completed false, prepends to array and returns it without calling saveTodos. `[test: npx jest tests/unit/implement-add-todo-function.test.ts]`
- [ ] Implement toggle todo function. Create `toggleTodo(todos: Todo[], id: string): Todo[]` that returns new array with matching item's completed boolean flipped, or unchanged if no match found, without calling saveTodos. `[test: npx jest tests/unit/implement-toggle-todo-function.test.ts]`
- [ ] Implement delete todo function. Create `deleteTodo(todos: Todo[], id: string): Todo[]` that returns new array with matching item removed, or unchanged if no match found, without calling saveTodos. `[test: npx jest tests/unit/implement-delete-todo-function.test.ts]`
