# PRD: Todo Logic & Data Layer

## Objective

Create a pure TypeScript module for to-do list CRUD operations with LocalStorage persistence, providing loadTodos, saveTodos, addTodo, toggleTodo, and deleteTodo functions that can be unit-tested with Jest.

## Context

The project is a static HTML/CSS/TypeScript site served by `serve` without any JavaScript framework. This ticket establishes the core data layer as a pure module (`src/todo.ts`) that handles all to-do item management independently of DOM operations. The module will use LocalStorage with key `"todos"` for persistence and export named functions for testing via Jest.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and storage constant. Create `src/todo.ts` with exported `Todo` interface (`id: string`, `text: string`, `completed: boolean`) and `STORAGE_KEY = "todos"` constant. `[test: npx jest tests/unit/define-todo-interface-storage-key.test.ts]`
- [ ] Implement loadTodos function. Export `loadTodos(): Todo[]` that reads `"todos"` from localStorage, parses JSON, returns the array or empty array on error/missing key. `[test: npx jest tests/unit/implement-loadtodos-function.test.ts]`
- [ ] Implement saveTodos function. Export `saveTodos(todos: Todo[]): void` that serializes the array to JSON and writes it to localStorage under `"todos"` key. `[test: npx jest tests/unit/implement-savetodos-function.test.ts]`
- [ ] Implement addTodo function. Export `addTodo(todos: Todo[], text: string): Todo[]` that returns unchanged if empty, otherwise creates new Todo with random UUID prepended to array. `[test: npx jest tests/unit/implement-addtodo-function.test.ts]`
- [ ] Implement toggleTodo function. Export `toggleTodo(todos: Todo[], id: string): Todo[]` that flips completed boolean for matching item or returns unchanged if no match. `[test: npx jest tests/unit/implement-toggletodo-function.test.ts]`
- [ ] Implement deleteTodo function. Export `deleteTodo(todos: Todo[], id: string): Todo[]` that removes matching item from array or returns unchanged if no match. `[test: npx jest tests/unit/implement-deletetodo-function.test.ts]`
