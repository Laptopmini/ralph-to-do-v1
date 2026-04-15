## Implementation Plan: To-Do List with Persistence

### Assumptions
- The existing "Hello World" placeholder page will be fully replaced by the to-do list application
- No JavaScript framework (React, Vue, etc.) will be introduced — the app remains a static vanilla HTML/CSS/JS site served by `serve`
- Each to-do item will have: a unique ID (generated via `crypto.randomUUID()`), a text description, and a completed boolean
- LocalStorage key will be `"todos"` storing a JSON-serialized array of to-do items
- No authentication, multi-user support, or server-side persistence is needed
- "Add Task" requires non-empty text input; empty submissions are silently ignored or prevented

---

### 1. Tech Stack & Architecture Notes

**Detected stack:** Static HTML/CSS/TypeScript served by `serve` (no framework)

**Relevant existing patterns:**
- Single-page app in `src/` with `index.html`, `style.css`, and TypeScript files
- `serve -s src -l 3000` serves the `src/` directory statically on port 3000
- Jest unit tests in `tests/unit/` matching `*.test.ts`
- Playwright E2E tests in `tests/e2e/` matching `*.spec.ts`
- TypeScript compiled via SWC for Jest; Playwright uses ts-node

**Recommendations:**
- Keep all logic in a pure TypeScript module (`src/todo.ts`) that can be unit-tested directly via Jest
- Compile `src/todo.ts` and `src/app.ts` to JavaScript files that are loaded by `index.html` via `<script>` tags — `serve` serves static files only, so the browser needs `.js` files
- Add a `build` script using `tsc` to compile TypeScript to JavaScript in `src/` (output `.js` alongside `.ts`) and update `start` to run build first
- Use a single CSS file (`src/style.css`) for all styling — no CSS preprocessor needed for this scope

---

### 2. File & Code Structure

**New files:**
- `src/todo.ts` — pure logic module: Todo type, CRUD operations, LocalStorage read/write
- `src/app.ts` — DOM wiring: event listeners, rendering, connects UI to todo.ts

**Modified files:**
- `src/index.html` — replace "Hello World" with to-do list markup
- `src/style.css` — replace base styles with to-do app styles
- `package.json` — add `build` script, update `start` to build first

**Conflicting test files to remove:**
- `tests/e2e/homepage.spec.ts` — tests for "Hello World" text which will no longer exist after the page is replaced

---

### 3. Tickets

Tickets are workstreams. No two tickets touch the same file. A ticket is workable once
all tickets in its `depends_on` list are complete. Siblings under the same parent run in parallel.

---

#### Ticket 1: Todo Logic & Data Layer

> Pure TypeScript module handling CRUD operations and LocalStorage persistence for to-do items.

**Constraints:**
- Must be a pure module with no DOM dependencies so it can be unit-tested with Jest
- Must use `localStorage` for persistence with the key `"todos"`
- All functions must be named exports

**Files owned:**
- `src/todo.ts` (create)

**Tasks:**
1. [logic] Define and export the `Todo` interface in `src/todo.ts` with fields: `id` (string), `text` (string), `completed` (boolean). Export a constant `STORAGE_KEY = "todos"` used for all LocalStorage operations
2. [logic] Implement and export `loadTodos(): Todo[]` — reads the `"todos"` key from `localStorage`, parses it as JSON, and returns the array. If the key is missing, the value is not valid JSON, or the parsed value is not an array, return an empty array `[]`
3. [logic] Implement and export `saveTodos(todos: Todo[]): void` — serializes the given array to JSON and writes it to `localStorage` under the `"todos"` key
4. [logic] Implement and export `addTodo(todos: Todo[], text: string): Todo[]` — if `text.trim()` is empty, return the array unchanged. Otherwise, create a new `Todo` with `id` set to `crypto.randomUUID()`, `text` set to the trimmed input, and `completed` set to `false`. Prepend the new item to the array and return the new array. Does not call `saveTodos` (caller is responsible for persistence)
5. [logic] Implement and export `toggleTodo(todos: Todo[], id: string): Todo[]` — return a new array where the item matching `id` has its `completed` boolean flipped. If no item matches, return the array unchanged. Does not call `saveTodos`
6. [logic] Implement and export `deleteTodo(todos: Todo[], id: string): Todo[]` — return a new array with the item matching `id` removed. If no item matches, return the array unchanged. Does not call `saveTodos`

---

#### Ticket 2: UI, Styling & Page Assembly
**depends_on:** [Ticket 1]

> HTML structure, CSS styling, and DOM wiring that connects the to-do UI to the logic module, plus build pipeline updates.

**Constraints:**
- Use `data-testid` attributes on all interactive and display elements
- Imports from Ticket 1 files are read-only — do not modify files owned by Ticket 1
- The page must be responsive (mobile and desktop) using CSS media queries or fluid layout
- All interactivity is wired via `src/app.ts` which imports from `src/todo.ts`
- The compiled `.js` output must be loadable by the browser via `<script>` tags

**Files owned:**
- `src/index.html` (modify)
- `src/style.css` (modify)
- `src/app.ts` (create)
- `package.json` (modify)
- `tests/e2e/homepage.spec.ts` (delete)

**Tasks:**
1. [infra] Delete `tests/e2e/homepage.spec.ts` — this E2E test asserts "Hello World" text and a stylesheet link on the homepage, both of which will no longer be valid after the page is replaced with the to-do app. Verify the file no longer exists on disk and that no other source files import or reference it
2. [infra] Modify `package.json` to add a `"build": "tsc --outDir src --allowJs --declaration false --sourceMap false --module ES2022 --target ES2022 --moduleResolution bundler --strict --rootDir src --include src/todo.ts src/app.ts"` script (or equivalent `tsc` invocation that compiles only `src/todo.ts` and `src/app.ts` to `.js` files in `src/`). Update `"start"` to `"npm run build && serve -s src -l 3000"`. Add `src/*.js` and `src/*.js.map` to `.gitignore` if not already ignored. The build must produce `src/todo.js` and `src/app.js` so they can be loaded by the browser
3. [ui] Replace the contents of `src/index.html` with the to-do app page structure. The page must include: a `<title>` of "To-Do List", a heading (`data-testid="app-title"`) reading "To-Do List", an input field (`data-testid="todo-input"`, type="text", placeholder="Add a new task..."), an "Add Task" button (`data-testid="add-task-btn"`), and a container for the to-do list (`data-testid="todo-list"`). When the list is empty, display an empty-state message (`data-testid="empty-state"`) reading "No tasks yet. Add one above!". Include `<script type="module" src="app.js"></script>` at the end of `<body>`. Keep the `<link rel="stylesheet" href="style.css" />` in `<head>`. Include proper `<meta charset>` and `<meta name="viewport">` tags
4. [ui] Replace the contents of `src/style.css` with a clean, modern, minimalist design. Requirements: center the app container with a max-width of 600px and auto margins; use `system-ui, sans-serif` font family; style the input field to be full-width with padding (12px), border (1px solid #ddd), and border-radius (8px); style the "Add Task" button with a solid background color (#2563eb), white text, padding (12px 24px), border-radius (8px), and a hover state (#1d4ed8); each to-do item should be a flex row with the checkbox on the left, task text in the center (flex-grow), and delete button on the right; completed tasks should have `text-decoration: line-through` and `opacity: 0.6`; the delete button should be styled with a red/danger color (#dc2626) with hover state (#b91c1c); add responsive styles so that on screens narrower than 480px, padding is reduced and the input/button stack vertically; add a subtle box-shadow on the app container and smooth transitions on interactive elements
5. [ui] Implement `src/app.ts` to wire the DOM to the logic layer. On `DOMContentLoaded`: import `loadTodos`, `saveTodos`, `addTodo`, `toggleTodo`, `deleteTodo` from `./todo.js` (note `.js` extension for ES module resolution). Load the initial to-do list from LocalStorage via `loadTodos()`. Implement a `render(todos: Todo[])` function that: clears the `todo-list` container, shows/hides the `empty-state` element based on whether todos is empty, and for each todo creates a list item (`data-testid="todo-item-{id}"`) containing: a checkbox (`data-testid="todo-checkbox-{id}"`) checked if `completed` is true, a span (`data-testid="todo-text-{id}"`) with the task text (add a `.completed` CSS class if completed), and a delete button (`data-testid="todo-delete-{id}"`) with text "Delete". Attach a click handler on the "Add Task" button that reads the input value, calls `addTodo`, saves via `saveTodos`, clears the input, and re-renders. Also trigger add on Enter keypress in the input field. Attach delegated click handlers for checkboxes (call `toggleTodo`, save, re-render) and delete buttons (call `deleteTodo`, save, re-render). Call `render` on initial load

---

> **Note:** A ticket is workable once all tickets in its `depends_on` list are complete — siblings under the same parent run in parallel. Tasks within each ticket are sequential. No ticket includes test creation — testing is handled separately.
