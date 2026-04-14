# PRD: Todo Logic & Data Layer

## Objective

Implement a pure TypeScript module handling CRUD operations and LocalStorage persistence for to-do items, providing loadTodos, saveTodos, addTodo, toggleTodo, and deleteTodo functions that can be unit-tested with Jest.

## Context

The project uses TypeScript with Jest for unit testing. This ticket establishes the data layer for the to-do list application — a pure module with no DOM dependencies that manages todo items in LocalStorage under the key "todos". The module will be imported by app.ts which handles DOM wiring, and all functions must use named exports for testability.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use localStorage for persistence with the key "todos"
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and storage constant. Create `src/todo.ts` with exported `Todo` interface containing fields: `id` (string), `text` (string), `completed` (boolean), and constant `STORAGE_KEY = "todos"`. `[test: npx jest tests/unit/define-todo-interface-storage-constant.test.ts]`
- [ ] Implement loadTodos function. Create exported function `loadTodos(): Todo[]` that reads the "todos" key from localStorage, parses it as JSON, and returns the array. If the key is missing, the value is not valid JSON, or the parsed value is not an array, return an empty array []. `[test: npx jest tests/unit/implement-loadtodos-function.test.ts]`
- [ ] Implement saveTodos function. Create exported function `saveTodos(todos: Todo[]): void` that serializes the given array to JSON and writes it to localStorage under the "todos" key. `[test: npx jest tests/unit/implement-savetodos-function.test.ts]`
- [ ] Implement addTodo function. Create exported function `addTodo(todos: Todo[], text: string): Todo[]` that returns the array unchanged if text.trim() is empty, otherwise creates a new Todo with id set to crypto.randomUUID(), text set to the trimmed input, and completed set to false, prepends it to the array, and returns the new array. Does not call saveTodos. `[test: npx jest tests/unit/implement-addtodo-function.test.ts]`
- [ ] Implement toggleTodo function. Create exported function `toggleTodo(todos: Todo[], id: string): Todo[]` that returns a new array where the item matching id has its completed boolean flipped. If no item matches, return the array unchanged. Does not call saveTodos. `[test: npx jest tests/unit/implement-toggletodo-function.test.ts]`
- [ ] Implement deleteTodo function. Create exported function `deleteTodo(todos: Todo[], id: string): Todo[]` that returns a new array with the item matching id removed. If no item matches, return the array unchanged. Does not call saveTodos. `[test: npx jest tests/unit/implement-deletetodo-function.test.ts]`
