# PRD: Storage & Todo Domain Logic

## Constraints

- Use named exports only (Biome `noDefaultExport` applies to `src/**`)
- Plain ES module JavaScript — no TypeScript, no frameworks, no external dependencies
- Pure functions where possible: `todos.js` must not touch `localStorage` or the DOM directly; only `storage.js` interacts with `window.localStorage`
- Format must match Biome config: 2-space indent, double quotes, trailing commas, semicolons, 100-char line width

## Tasks

- [ ] Create storage module. Create `src/storage.js` with named exports: `loadTodos()` returns array from localStorage key `todos-v1` (returns `[]` on missing/invalid/error), `saveTodos(todos)` saves JSON to same key (silently swallows `QuotaExceededError`); validate array entries have string `id`, string `text`, boolean `completed`, numeric `createdAt` and drop malformed ones. `[test: npx jest tests/unit/create-storage-module.test.ts]`
- [ ] Create todos module. Create `src/todos.js` with pure, DOM-free named exports: `createTodo(text)` returns `{ id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() }`, throws error if trimmed text is empty or not a string; `addTodo(todos, text)` returns new array with todo appended; `toggleTodo(todos, id)` returns new array with matching todo's `completed` flipped (returns original reference if no match); `deleteTodo(todos, id)` returns new array with matching todo removed (returns original reference if no match); none mutate inputs. `[test: npx jest tests/unit/create-todos-module.test.ts]`
