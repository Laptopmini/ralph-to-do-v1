# PRD: Todo Logic & Data Layer

## Objective

Implement a pure TypeScript module (`src/todo.ts`) that defines the `Todo` data type and provides all CRUD operations with LocalStorage persistence. This module is the single source of truth for todo data — it is intentionally free of any DOM or browser UI dependencies so it can be unit-tested with Jest in isolation.

## Context

- **Stack:** Static HTML/CSS/TypeScript single-page app served by `serve -s src -l 3000`. No framework.
- **Source layout:** Application code lives in `src/`. Jest unit tests live in `tests/unit/` and match `*.test.ts`. TypeScript is compiled via SWC for Jest.
- **Architecture decision:** All data logic is isolated in `src/todo.ts` as pure functions. The DOM-wiring layer (`src/app.ts`, a later ticket) imports from this module. This separation lets you test every operation without a browser.
- **LocalStorage key:** The constant `STORAGE_KEY = "todos"` is defined here and must be used consistently by all persistence functions.
- **ID generation:** Use `crypto.randomUUID()` — available in modern browsers and Node 19+.
- **Immutability convention:** CRUD functions return a new array; they do **not** mutate the input array or call `saveTodos`. The caller is responsible for persisting after each mutation.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define the Todo interface and storage key. In `src/todo.ts`, export a TypeScript `interface Todo` with three fields: `id: string`, `text: string`, and `completed: boolean`. Also export the constant `STORAGE_KEY = "todos"` (type `string`) that all LocalStorage calls in this module will reference. `[test: npx jest tests/unit/define-todo-interface-storage-key.test.ts]`

- [ ] Implement loadTodos. In `src/todo.ts`, export `loadTodos(): Todo[]`. It must read `localStorage.getItem(STORAGE_KEY)`, attempt `JSON.parse`, and return the parsed array if it is a non-null array. Return `[]` in all error cases: key not present (null), JSON parse throws, or the parsed value is not an array. `[test: npx jest tests/unit/implement-loadtodos.test.ts]`

- [ ] Implement saveTodos. In `src/todo.ts`, export `saveTodos(todos: Todo[]): void`. It must call `localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))`. No return value. `[test: npx jest tests/unit/implement-savetodos.test.ts]`

- [ ] Implement addTodo. In `src/todo.ts`, export `addTodo(todos: Todo[], text: string): Todo[]`. If `text.trim()` is an empty string, return the original `todos` array unchanged. Otherwise, create a new `Todo` object with `id` set to `crypto.randomUUID()`, `text` set to `text.trim()`, and `completed` set to `false`, then return a new array with the new item prepended: `[newTodo, ...todos]`. Do not call `saveTodos`. `[test: npx jest tests/unit/implement-addtodo.test.ts]`

- [ ] Implement toggleTodo. In `src/todo.ts`, export `toggleTodo(todos: Todo[], id: string): Todo[]`. Return a new array where the item whose `id` matches the given `id` has its `completed` field flipped (`!completed`); all other items are unchanged. If no item matches, return the original array unchanged. Do not mutate the input array. Do not call `saveTodos`. `[test: npx jest tests/unit/implement-toggletodo.test.ts]`

- [ ] Implement deleteTodo. In `src/todo.ts`, export `deleteTodo(todos: Todo[], id: string): Todo[]`. Return a new array with the item matching `id` filtered out. If no item matches, return the original array unchanged. Do not mutate the input array. Do not call `saveTodos`. `[test: npx jest tests/unit/implement-deletetodo.test.ts]`
