# PRD: Todo Logic & Data Layer

## Objective

Create a pure TypeScript module that handles CRUD operations and LocalStorage persistence for to-do items. This module will be importable by Jest for unit testing and provide the data layer foundation for the UI layer.

## Context

**Assumptions:**
- Each to-do item has: a unique ID (generated via `crypto.randomUUID()`), a text description, and a completed boolean
- LocalStorage key is `"todos"` storing a JSON-serialized array of to-do items
- No authentication, multi-user support, or server-side persistence is needed
- "Add Task" requires non-empty text input; empty submissions are silently ignored or prevented

**Tech Stack & Architecture Notes:**
- Detected stack: Static HTML/CSS/TypeScript served by `serve` (no framework)
- The app will be a pure vanilla HTML/CSS/JS site — no React, Vue, or other JavaScript frameworks
- TypeScript needs to be compiled to JavaScript for browser consumption via `<script>` tags
- Jest unit tests run in Node.js environment; Playwright E2E tests use ts-node

**Recommendations:**
- Keep all logic in a pure TypeScript module (`src/todo.ts`) that can be unit-tested directly via Jest
- The module should have no DOM dependencies so it can be tested independently
- All functions should be named exports for easy importing and testing

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface. Create src/todo.ts with exported Todo interface (id: string, text: string, completed: boolean) and constant STORAGE_KEY = "todos". `[test: npx jest tests/unit/define-todo-interface.test.ts]`
- [ ] Implement loadTodos function. Export loadTodos(): Todo[] that reads the "todos" key from localStorage, parses it as JSON, and returns the array. If the key is missing, the value is not valid JSON, or the parsed value is not an array, return an empty array []. `[test: npx jest tests/unit/implement-loadtodos-function.test.ts]`
- [ ] Implement saveTodos function. Export saveTodos(todos: Todo[]): void that serializes the given array to JSON and writes it to localStorage under the "todos" key. `[test: npx jest tests/unit/implement-savetodos-function.test.ts]`
- [ ] Implement addTodo function. Export addTodo(todos: Todo[], text: string): Todo[] that if text.trim() is empty, returns the array unchanged; otherwise creates a new Todo with id set to crypto.randomUUID(), text set to the trimmed input, and completed set to false, prepending it to the array and returning the new array without calling saveTodos. `[test: npx jest tests/unit/implement-addtodo-function.test.ts]`
- [ ] Implement toggleTodo function. Export toggleTodo(todos: Todo[], id: string): Todo[] that returns a new array where the item matching id has its completed boolean flipped; if no item matches, return the array unchanged without calling saveTodos. `[test: npx jest tests/unit/implement-toggletodo-function.test.ts]`
- [ ] Implement deleteTodo function. Export deleteTodo(todos: Todo[], id: string): Todo[] that returns a new array with the item matching id removed; if no item matches, return the array unchanged without calling saveTodos. `[test: npx jest tests/unit/implement-deletetodo-function.test.ts]`
