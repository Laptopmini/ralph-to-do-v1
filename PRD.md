# PRD: Todo Logic & Data Layer

## Objective

Implement a pure TypeScript module handling CRUD operations and LocalStorage persistence for to-do items, providing loadTodos, saveTodos, addTodo, toggleTodo, and deleteTodo functions that can be unit-tested with Jest.

## Context

The project is a static HTML/CSS/TypeScript application served by `serve` with no JavaScript framework. Each to-do item has a unique ID (generated via `crypto.randomUUID()`), a text description, and a completed boolean. LocalStorage will store todos under the key `"todos"` as a JSON-serialized array. This ticket establishes the data layer that other components will depend on.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and storage constant. Create `src/todo.ts` with exported `Todo` interface (`id: string`, `text: string`, `completed: boolean`) and constant `STORAGE_KEY = "todos"`. `[test: npx jest tests/unit/define-todo-interface-storage-constant.test.ts]`
- [ ] Implement loadTodos function. Create and export `loadTodos(): Todo[]` that reads the `"todos"` key from localStorage, parses as JSON, returns array if valid or empty array `[]` if missing/invalid/not an array. `[test: npx jest tests/unit/implement-loadtodos-function.test.ts]`
- [ ] Implement saveTodos function. Create and export `saveTodos(todos: Todo[]): void` that serializes the given array to JSON and writes it to localStorage under the `"todos"` key. `[test: npx jest tests/unit/implement-savetodos-function.test.ts]`
- [ ] Implement addTodo function. Create and export `addTodo(todos: Todo[], text: string): Todo[]` that returns unchanged if text.trim() is empty, otherwise creates new Todo with crypto.randomUUID(), trimmed text, completed=false, prepends to array, and returns new array without calling saveTodos. `[test: npx jest tests/unit/implement-addtodo-function.test.ts]`
- [ ] Implement toggleTodo function. Create and export `toggleTodo(todos: Todo[], id: string): Todo[]` that returns new array with matching item's completed boolean flipped, or unchanged if no match, without calling saveTodos. `[test: npx jest tests/unit/implement-toggletodo-function.test.ts]`
- [ ] Implement deleteTodo function. Create and export `deleteTodo(todos: Todo[], id: string): Todo[]` that returns new array with matching item removed, or unchanged if no match, without calling saveTodos. `[test: npx jest tests/unit/implement-deletetodo-function.test.ts]`
