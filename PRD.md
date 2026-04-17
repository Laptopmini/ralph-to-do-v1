# PRD: Storage & Todo Domain Logic

## Constraints

- Use named exports only (Biome `noDefaultExport` applies to `src/**`)
- Plain ES module JavaScript — no TypeScript, no frameworks, no external dependencies
- Pure functions where possible: `todos.js` must not touch `localStorage` or the DOM directly; only `storage.js` interacts with `window.localStorage`
- Format must match Biome config: 2-space indent, double quotes, trailing commas, semicolons, 100-char line width

## Tasks

- [ ] Create storage module. Create `src/storage.js` with named exports: `loadTodos()` returns an array of todo objects from key `todos-v1` in `window.localStorage`, returning `[]` on missing key, invalid JSON, or errors; `saveTodos(todos)` JSON-stringifies and writes to the same key, silently swallowing `QuotaExceededError`; validate parsed result is an array where each entry has string `id`, string `text`, boolean `completed`, and numeric `createdAt`, dropping malformed entries. `[test: npx jest tests/unit/create-storage-module.test.ts]`
- [ ] Create todos module. Create `src/todos.js` with pure, DOM-free named functions operating on immutable arrays: `createTodo(text)` returns `{ id: crypto.randomUUID(), text: trimmedText, completed: false, createdAt: Date.now() }`, throwing `Error("Todo text must not be empty")` if trimmed input is empty or not a string; `addTodo(todos, text)` returns new array with todo appended; `toggleTodo(todos, id)` returns new array with matching todo's `completed` flipped (original reference if no match); `deleteTodo(todos, id)` returns new array with matching todo removed (original reference if no match). `[test: npx jest tests/unit/create-todos-module.test.ts]`
