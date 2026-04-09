# PRD: Todo Logic & Data Layer

## Objective

Create a pure TypeScript module (`src/todo.ts`) that handles CRUD operations and LocalStorage persistence for to-do items. This module provides the data layer with no DOM dependencies, making it testable via Jest.

## Context

This is part of building a static To-Do List application served by `serve`. The stack consists of HTML/CSS/TypeScript without any JavaScript framework. TypeScript will be compiled to JavaScript files that are loaded by `index.html` via `<script>` tags. The app uses LocalStorage with the key `"todos"` for persistence, storing a JSON-serialized array of todo items. Each todo item has: a unique ID (via `crypto.randomUUID()`), text description, and completed boolean flag.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and STORAGE_KEY constant. Create src/todo.ts with exported Todo interface containing id (string), text (string), completed (boolean) fields, and export const STORAGE_KEY = "todos" used for all LocalStorage operations. [test: npx jest tests/unit/define-todo-interface-and-storage-key-constant.test.ts]
- [ ] Implement loadTodos function. Create exported function `loadTodos(): Todo[]` that reads the "todos" key from localStorage, parses it as JSON, and returns the array. If the key is missing, value is not valid JSON, or parsed value is not an array, return empty array []. [test: npx jest tests/unit/implement-load-todos-function.test.ts]
- [ ] Implement saveTodos function. Create exported function `saveTodos(todos: Todo[]): void` that serializes the given array to JSON and writes it to localStorage under the "todos" key. [test: npx jest tests/unit/implement-save-todos-function.test.ts]
- [ ] Implement addTodo function. Create exported function `addTodo(todos: Todo[], text: string): Todo[]` that returns unchanged array if text.trim() is empty, otherwise creates new Todo with id from crypto.randomUUID(), trimmed text, completed false, prepends to array and returns it without calling saveTodos. [test: npx jest tests/unit/implement-add-todo-function.test.ts]
- [ ] Implement toggleTodo function. Create exported function `toggleTodo(todos: Todo[], id: string): Todo[]` that returns new array with item matching id having completed boolean flipped, or unchanged array if no match found, without calling saveTodos. [test: npx jest tests/unit/implement-toggle-todo-function.test.ts]
- [ ] Implement deleteTodo function. Create exported function `deleteTodo(todos: Todo[], id: string): Todo[]` that returns new array with item matching id removed, or unchanged array if no match found, without calling saveTodos. [test: npx jest tests/unit/implement-delete-todo-function.test.ts]
