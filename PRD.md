# PRD: Storage & Todo Domain Logic

## Tasks

- [ ] Create storage module. Create `src/storage.js` with named exports: `loadTodos()` returns array from localStorage key `todos-v1` (returns empty array on missing/invalid JSON/error), `saveTodos(todos)` writes JSON string to same key (silently swallows `QuotaExceededError`), validates parsed result is array where each entry has string `id`, string `text`, boolean `completed`, numeric `createdAt` (drops malformed entries). `[test: npx jest tests/unit/create-storage-module.test.ts]`
- [ ] Create todos domain module. Create `src/todos.js` with pure named exports: `createTodo(text)` returns `{ id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() }` (throws Error if trimmed text is empty or not a string), `addTodo(todos, text)` returns new array with todo appended, `toggleTodo(todos, id)` returns new array with matching todo's `completed` flipped (returns original reference if no match), `deleteTodo(todos, id)` returns new array with matching todo removed (returns original reference if no match); none of these functions mutate their inputs. `[test: npx jest tests/unit/create-todos-module.test.ts]`
