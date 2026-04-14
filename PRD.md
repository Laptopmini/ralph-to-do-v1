# PRD: Todo Logic Data Layer

## Objective

Create a pure TypeScript module handling CRUD operations and LocalStorage persistence for to-do items, providing the data layer for the to-do list application.

## Context

The project uses TypeScript with Jest for unit testing. The application is a static site served by `serve`, with no framework dependencies. This ticket establishes the foundational data layer that will be consumed by the UI module. All functions must be pure and testable without DOM dependencies, using LocalStorage key `"todos"` for persistence.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and storage constant. Create `src/todo.ts` and export `Todo` interface with fields: `id` (string), `text` (string), `completed` (boolean); also export `STORAGE_KEY = "todos"` for LocalStorage operations. `[test: npx jest tests/unit/define-todo-interface-storage-constant.test.ts]`
- [ ] Implement load todos function. Export `loadTodos(): Todo[]` that reads the `"todos"` key from localStorage, parses as JSON, and returns the array; if missing, invalid JSON, or not an array, return empty array `[]`. `[test: npx jest tests/unit/implement-load-todos-function.test.ts]`
- [ ] Implement save todos function. Export `saveTodos(todos: Todo[]): void` that serializes the given array to JSON and writes it to localStorage under the `"todos"` key. `[test: npx jest tests/unit/implement-save-todos-function.test.ts]`
- [ ] Implement add todo function. Export `addTodo(todos: Todo[], text: string): Todo[]` that returns unchanged if `text.trim()` is empty; otherwise creates new Todo with `id` from `crypto.randomUUID()`, trimmed `text`, and `completed: false`, prepends to array, and returns new array without calling saveTodos. `[test: npx jest tests/unit/implement-add-todo-function.test.ts]`
- [ ] Implement toggle todo function. Export `toggleTodo(todos: Todo[], id: string): Todo[]` that returns a new array where the item matching `id` has its `completed` boolean flipped; if no match, return unchanged without calling saveTodos. `[test: npx jest tests/unit/implement-toggle-todo-function.test.ts]`
- [ ] Implement delete todo function. Export `deleteTodo(todos: Todo[], id: string): Todo[]` that returns a new array with the item matching `id` removed; if no match, return unchanged without calling saveTodos. `[test: npx jest tests/unit/implement-delete-todo-function.test.ts]`
