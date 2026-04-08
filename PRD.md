# PRD: Todo Logic & Data Layer

## Objective

Implement a pure TypeScript module (`src/todo.ts`) that defines the `Todo` data type, a LocalStorage persistence key constant, and all CRUD operations (load, save, add, toggle, delete) for to-do items. This module must have no DOM dependencies so it can be fully unit-tested with Jest.

## Context

The application is a static vanilla HTML/CSS/TypeScript site served by `serve -s src -l 3000`. There is no framework. Logic is kept in a pure TypeScript module (`src/todo.ts`) that can be imported directly by Jest for unit testing. TypeScript is compiled via SWC for Jest. Unit tests live in `tests/unit/` and match `*.test.ts`. Each to-do item has a unique ID (generated via `crypto.randomUUID()`), a text description, and a completed boolean. LocalStorage is used for persistence with the key `"todos"` storing a JSON-serialized array of to-do items. All functions in `src/todo.ts` must be named exports so they can be imported individually by both tests and the DOM wiring layer (`src/app.ts`, to be created in a separate ticket).

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface. Create `src/todo.ts` and export the `Todo` interface with three fields: `id: string`, `text: string`, and `completed: boolean`. Also export a constant `STORAGE_KEY = "todos"` (type `string`) that will be used as the LocalStorage key in all persistence operations. `[test: npx jest tests/unit/define-todo-interface.test.ts]`
- [ ] Implement loadTodos. In `src/todo.ts`, implement and export `loadTodos(): Todo[]` — call `localStorage.getItem(STORAGE_KEY)`, and if the result is `null`, is not valid JSON, or does not parse to an array, return `[]`. Otherwise return the parsed array. `[test: npx jest tests/unit/implement-loadtodos.test.ts]`
- [ ] Implement saveTodos. In `src/todo.ts`, implement and export `saveTodos(todos: Todo[]): void` — serialize the given array with `JSON.stringify` and write it to `localStorage` under `STORAGE_KEY`. `[test: npx jest tests/unit/implement-savetodos.test.ts]`
- [ ] Implement addTodo. In `src/todo.ts`, implement and export `addTodo(todos: Todo[], text: string): Todo[]` — if `text.trim()` is empty, return the original array unchanged. Otherwise create a new `Todo` with `id: crypto.randomUUID()`, `text: text.trim()`, and `completed: false`, prepend it to the array, and return the new array. This function must not call `saveTodos`. `[test: npx jest tests/unit/implement-addtodo.test.ts]`
- [ ] Implement toggleTodo. In `src/todo.ts`, implement and export `toggleTodo(todos: Todo[], id: string): Todo[]` — return a new array where the item whose `id` matches the given `id` has its `completed` boolean flipped. If no item matches, return the array unchanged. This function must not call `saveTodos`. `[test: npx jest tests/unit/implement-toggletodo.test.ts]`
- [ ] Implement deleteTodo. In `src/todo.ts`, implement and export `deleteTodo(todos: Todo[], id: string): Todo[]` — return a new array with the item whose `id` matches the given `id` removed. If no item matches, return the array unchanged. This function must not call `saveTodos`. `[test: npx jest tests/unit/implement-deletetodo.test.ts]`
