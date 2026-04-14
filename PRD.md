# PRD: Todo Logic Data Layer

## Objective

Create a pure TypeScript module for CRUD operations and LocalStorage persistence of to-do items, providing named exports that can be unit-tested with Jest without any DOM dependencies.

## Context

The project uses TypeScript with Jest for unit testing. This ticket establishes the data layer as a standalone module (`src/todo.ts`) that handles all to-do item logic including adding, toggling completion status, deleting, and persisting to LocalStorage under the key "todos". No framework or build step is required for this pure logic module—it can be imported directly by Jest tests.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use localStorage for persistence with the key "todos"
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and storage constant. Create `src/todo.ts` with exported `Todo` interface containing fields: `id` (string), `text` (string), `completed` (boolean); export constant `STORAGE_KEY = "todos"` for LocalStorage operations. `[test: npx jest tests/unit/define-todo-interface-storage-constant.test.ts]`
- [ ] Implement load todos function. Create and export `loadTodos(): Todo[]` that reads the "todos" key from localStorage, parses it as JSON, returns the array; if key is missing, value is not valid JSON, or parsed value is not an array, return empty array `[]`. `[test: npx jest tests/unit/implement-load-todos-function.test.ts]`
- [ ] Implement save todos function. Create and export `saveTodos(todos: Todo[]): void` that serializes the given array to JSON and writes it to localStorage under the "todos" key. `[test: npx jest tests/unit/implement-save-todos-function.test.ts]`
- [ ] Implement add todo function. Create and export `addTodo(todos: Todo[], text: string): Todo[]` that returns unchanged array if `text.trim()` is empty; otherwise creates new Todo with `id` from `crypto.randomUUID()`, trimmed text, `completed` set to false, prepends it to the array and returns the new array without calling saveTodos. `[test: npx jest tests/unit/implement-add-todo-function.test.ts]`
- [ ] Implement toggle todo function. Create and export `toggleTodo(todos: Todo[], id: string): Todo[]` that returns a new array where the item matching `id` has its `completed` boolean flipped; if no item matches, return unchanged array without calling saveTodos. `[test: npx jest tests/unit/implement-toggle-todo-function.test.ts]`
- [ ] Implement delete todo function. Create and export `deleteTodo(todos: Todo[], id: string): Todo[]` that returns a new array with the item matching `id` removed; if no item matches, return unchanged array without calling saveTodos. `[test: npx jest tests/unit/implement-delete-todo-function.test.ts]`
