# PRD: Storage & Todo Domain Logic

## Constraints

- Use named exports only (Biome `noDefaultExport` applies to `src/**`)
- Plain ES module JavaScript — no TypeScript, no frameworks, no external dependencies
- Pure functions where possible: `todos.js` must not touch `localStorage` or the DOM directly; only `storage.js` interacts with `window.localStorage`
- Format must match Biome config: 2-space indent, double quotes, trailing commas, semicolons, 100-char line width

## Tasks

- [ ] Create storage module. Create `src/storage.js` — export named function `loadTodos()` that reads key `todos-v1` from `window.localStorage`, parses JSON and returns array (empty array on missing/invalid/error), and export named function `saveTodos(todos)` that stringifies array to JSON and writes to same key, silently swallowing `QuotaExceededError`; validate parsed result is array with entries having string `id`, string `text`, boolean `completed`, numeric `createdAt` — drop malformed entries. `[test: npx jest tests/unit/create-storage-module.test.ts]`
- [ ] Create todos domain module. Create `src/todos.js` — export pure named function `createTodo(text)` that returns new todo object with `id` from `crypto.randomUUID()`, trimmed `text`, `completed: false`, and `createdAt` as `Date.now()` (throws Error if text empty/not string), export `addTodo(todos, text)` returning new array with appended todo, export `toggleTodo(todos, id)` returning new array with matching todo's `completed` flipped (return original reference if no match), export `deleteTodo(todos, id)` returning new array without matching todo (return original reference if no match); none of these functions mutate inputs. `[test: npx jest tests/unit/create-todos-domain-module.test.ts]`
