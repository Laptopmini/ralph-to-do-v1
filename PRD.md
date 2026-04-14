# PRD: Todo Logic & Data Layer

## Objective

Implement a pure TypeScript module handling CRUD operations and LocalStorage persistence for to-do items, enabling unit testing with Jest while providing the foundational data layer for the application.

## Context

The project uses TypeScript served statically by `serve` without any JavaScript framework. This ticket establishes the first core module that will be imported and tested independently of DOM APIs. The module must use `localStorage` with the key `"todos"` to persist to-do items as a JSON-serialized array. All functions are named exports for easy testing and composition.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and STORAGE_KEY constant. Create `src/todo.ts` with exported `Todo` interface containing fields: `id` (string), `text` (string), `completed` (boolean); also export constant `STORAGE_KEY = "todos"` for LocalStorage operations. `[test: npx jest tests/unit/define-todo-interface-constant.test.ts]`
- [ ] Implement loadTodos function. Create exported function `loadTodos(): Todo[]` that reads the `"todos"` key from localStorage, parses it as JSON, and returns the array; if the key is missing, value is not valid JSON, or parsed value is not an array, return empty array `[]`. `[test: npx jest tests/unit/implement-load-todos-function.test.ts]`
- [ ] Implement saveTodos function. Create exported function `saveTodos(todos: Todo[]): void` that serializes the given array to JSON and writes it to localStorage under the `"todos"` key. `[test: npx jest tests/unit/implement-save-todos-function.test.ts]`
- [ ] Implement addTodo function. Create exported function `addTodo(todos: Todo[], text: string): Todo[]` that returns unchanged array if `text.trim()` is empty; otherwise creates new Todo with `id` set to `crypto.randomUUID()`, `text` set to trimmed input, and `completed` set to false; prepends new item to array and returns new array without calling saveTodos. `[test: npx jest tests/unit/implement-add-todo-function.test.ts]`
- [ ] Implement toggleTodo function. Create exported function `toggleTodo(todos: Todo[], id: string): Todo[]` that returns a new array where the item matching `id` has its `completed` boolean flipped; if no item matches, return array unchanged without calling saveTodos. `[test: npx jest tests/unit/implement-toggle-todo-function.test.ts]`
- [ ] Implement deleteTodo function. Create exported function `deleteTodo(todos: Todo[], id: string): Todo[]` that returns a new array with the item matching `id` removed; if no item matches, return array unchanged without calling saveTodos. `[test: npx jest tests/unit/implement-delete-todo-function.test.ts]`
