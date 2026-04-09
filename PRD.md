# PRD: Todo Logic & Data Layer

## Objective

Create a pure TypeScript module that handles CRUD operations and LocalStorage persistence for to-do items. This module will provide all the data layer functionality needed by the to-do list application, including defining the Todo interface, loading/saving todos from LocalStorage, and implementing add, toggle, and delete operations.

## Context

The existing "Hello World" placeholder page will be fully replaced by a to-do list application. The app remains a static vanilla HTML/CSS/JS site served by `serve` — no JavaScript framework like React or Vue will be introduced.

**Detected stack:** Static HTML/CSS/TypeScript served by `serve` (no framework)

**Relevant existing patterns:**
- Single-page app in `src/` with `index.html`, `style.css`, and TypeScript files
- `serve -s src -l 3000` serves the `src/` directory statically on port 3000
- Jest unit tests in `tests/unit/` matching `*.test.ts`
- Playwright E2E tests in `tests/e2e/` matching `*.spec.ts`
- TypeScript compiled via SWC for Jest; Playwright uses ts-node

**Recommendations:**
- Keep all logic in a pure TypeScript module (`src/todo.ts`) that can be unit-tested directly via Jest
- Each to-do item will have: a unique ID (generated via `crypto.randomUUID()`), a text description, and a completed boolean
- LocalStorage key will be `"todos"` storing a JSON-serialized array of to-do items

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and STORAGE_KEY constant. Create src/todo.ts with exported Todo interface having fields: id (string), text (string), completed (boolean). Export a constant STORAGE_KEY = "todos" used for all LocalStorage operations. `[test: npx jest tests/unit/define-todo-interface-storage-key-constant.test.ts]`
- [ ] Implement loadTodos function. Create and export `loadTodos(): Todo[]` — reads the "todos" key from localStorage, parses it as JSON, and returns the array. If the key is missing, the value is not valid JSON, or the parsed value is not an array, return an empty array []. `[test: npx jest tests/unit/implement-loadtodos-function.test.ts]`
- [ ] Implement saveTodos function. Create and export `saveTodos(todos: Todo[]): void` — serializes the given array to JSON and writes it to localStorage under the "todos" key. `[test: npx jest tests/unit/implement-saveTodos-function.test.ts]`
- [ ] Implement addTodo function. Create and export `addTodo(todos: Todo[], text: string): Todo[]` — if text.trim() is empty, return the array unchanged. Otherwise, create a new Todo with id set to crypto.randomUUID(), text set to the trimmed input, and completed set to false. Prepend the new item to the array and return the new array. Does not call saveTodos (caller is responsible for persistence). `[test: npx jest tests/unit/implement-addtodo-function.test.ts]`
- [ ] Implement toggleTodo function. Create and export `toggleTodo(todos: Todo[], id: string): Todo[]` — return a new array where the item matching id has its completed boolean flipped. If no item matches, return the array unchanged. Does not call saveTodos. `[test: npx jest tests/unit/implement-toggletodo-function.test.ts]`
- [ ] Implement deleteTodo function. Create and export `deleteTodo(todos: Todo[], id: string): Todo[]` — return a new array with the item matching id removed. If no item matches, return the array unchanged. Does not call saveTodos. `[test: npx jest tests/unit/implement-deletetodo-function.test.ts]`
