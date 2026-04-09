# PRD: Todo Logic & Data Layer

## Objective

Create a pure TypeScript module that handles CRUD operations and LocalStorage persistence for to-do items. This module provides the data layer abstraction that will be used by the UI component.

## Context

This is part of building a To-Do List application with persistence. The app uses vanilla HTML/CSS/JavaScript served statically via `serve` — no JavaScript frameworks like React or Vue are being introduced.

The architecture separates concerns into two TypeScript modules:
- `src/todo.ts` — pure logic module for CRUD operations (this ticket)
- `src/app.ts` — DOM wiring that connects the UI to the todo logic

LocalStorage with key `"todos"` will persist data across page refreshes. Each to-do item has a unique ID generated via `crypto.randomUUID()`, a text description, and a completed boolean flag.

## Constraints

- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

## Tasks

- [ ] Define Todo interface and STORAGE_KEY constant. Create src/todo.ts with exported Todo interface containing id (string), text (string), completed (boolean) fields, and export const STORAGE_KEY = "todos". [test: npx jest tests/unit/define-todo-interface-storag-key-constant.test.ts]
- [ ] Implement loadTodos function. Create and export loadTodos(): Todo[] — reads the "todos" key from localStorage, parses it as JSON, and returns the array. If the key is missing, the value is not valid JSON, or the parsed value is not an array, return an empty array []. [test: npx jest tests/unit/implement-loadtodos-function.test.ts]
- [ ] Implement saveTodos function. Create and export saveTodos(todos: Todo[]): void — serializes the given array to JSON and writes it to localStorage under the "todos" key. [test: npx jest tests/unit/implement-save todos-function.test.ts]
- [ ] Implement addTodo function. Create and export addTodo(todos: Todo[], text: string): Todo[] — if text.trim() is empty, return the array unchanged. Otherwise, create a new Todo with id set to crypto.randomUUID(), text set to the trimmed input, and completed set to false. Prepend the new item to the array and return the new array without calling saveTodos. [test: npx jest tests/unit/implement-addtodo-function.test.ts]
- [ ] Implement toggleTodo function. Create and export toggleTodo(todos: Todo[], id: string): Todo[] — return a new array where the item matching id has its completed boolean flipped. If no item matches, return the array unchanged without calling saveTodos. [test: npx jest tests/unit/implement-toggletodo-function.test.ts]
- [ ] Implement deleteTodo function. Create and export deleteTodo(todos: Todo[], id: string): Todo[] — return a new array with the item matching id removed. If no item matches, return the array unchanged without calling saveTodos. [test: npx jest tests/unit/implement-deletetodo-function.test.ts]
