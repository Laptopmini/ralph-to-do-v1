## Implementation Plan: Persistent To-Do List with LocalStorage

### Assumptions
- The site is served as static files via `serve -s src` on port 3000 — no build/bundler pipeline, so browser-executed code must ship as plain `.js` files that work with native ES module `<script type="module">` loading.
- A single-page To-Do app (no routing, no auth, no backend) is in scope — all state is local to the browser and persisted via `localStorage`.
- The existing `tests/e2e/homepage.spec.ts` asserts "Hello World" and a linked stylesheet — the "Hello World" assertion will be invalidated and the whole file must be removed (a fresh E2E spec is out of scope per testing policy).
- `src/index.ts` is an empty placeholder unrelated to runtime — it will be left untouched.
- LocalStorage key `todos-v1` will be used. Each todo is `{ id: string, text: string, completed: boolean, createdAt: number }` where `id` is a crypto-random string.
- Minimum supported breakpoints: mobile (≤480px), tablet (481–768px), desktop (>768px).
- Biome forbids default exports outside `app/**` and `pages/**` — all new modules use named exports.

---

### 1. Tech Stack & Architecture Notes

**Detected stack:** Static HTML/CSS/JS served by `serve` (vercel/serve) on port 3000. TypeScript (ES2022, NodeNext, strict) is configured but only applies to non-browser code. Jest + `@swc/jest` for unit tests (`tests/unit/**/*.test.ts`). Playwright 1.58 for E2E (`tests/e2e/**/*.spec.ts`, `webServer` runs `npm start`). Biome 2.4.8 for lint/format (2-space indent, double quotes, trailing commas, semicolons, 100-char lines). No framework, no bundler.

**Relevant existing patterns:**
- All runtime assets live flat under `src/` (`index.html`, `style.css`, `index.ts`).
- `index.html` links `style.css` via relative href — scripts must follow the same relative convention (`<script type="module" src="app.js">`).
- Biome's `noDefaultExport` override only applies to `app/**` and `pages/**`, so modules under `src/` must use named exports.
- Playwright `baseURL` is `http://localhost:3000` — any `data-testid` selectors must be stable for future test authoring.

**Recommendations:**
- Ship browser code as plain `.js` ES modules (no TS in the browser path) — there is no compiler step to transpile TS into `src/` and `serve` will not touch files. Keep all logic in pure, importable modules so a later unit-testing effort can exercise them with Jest.
- Use CSS custom properties for the design tokens (color, spacing, radius, transition timing) so the minimalist look stays consistent and responsive media queries can re-tune values cleanly.
- Use `prefers-reduced-motion: reduce` to disable transform/opacity animations for accessibility.
- Use `crypto.randomUUID()` for todo IDs (available in all evergreen browsers targeted by Playwright Chromium).

---

### 2. File & Code Structure

**New files:**
- `src/storage.js`
- `src/todos.js`
- `src/app.js`

**Modified files:**
- `src/index.html`
- `src/style.css`

**Conflicting test files to remove:**
- `tests/e2e/homepage.spec.ts` — asserts the "Hello World" heading and is invalidated by replacing the page with the To-Do application.

---

### 3. Tickets

Tickets are workstreams. No two tickets touch the same file. A ticket is workable once
all tickets in its `depends_on` list are complete. Siblings under the same parent run in parallel.

---

#### Ticket 1: Storage & Todo Domain Logic

> Build the pure, DOM-free modules that read/write todos to `localStorage` and perform create/toggle/delete operations.

**Constraints:**
- Use named exports only (Biome `noDefaultExport` applies to `src/**`).
- Plain ES module JavaScript — no TypeScript, no frameworks, no external dependencies.
- Pure functions where possible: `todos.js` must not touch `localStorage` or the DOM directly; only `storage.js` interacts with `window.localStorage`.
- Format must match Biome config: 2-space indent, double quotes, trailing commas, semicolons, 100-char line width.

**Files owned:**
- `src/storage.js` (create)
- `src/todos.js` (create)

**Tasks:**
1. [logic] Create `src/storage.js` — export two named functions: `loadTodos()` returns an array of todo objects by reading key `todos-v1` from `window.localStorage` and `JSON.parse`-ing the value; on missing key, invalid JSON, or any thrown error it returns `[]`. Export `saveTodos(todos)` which `JSON.stringify`-s the array and writes it to the same key; it silently swallows `QuotaExceededError` (no throw). Validate that the parsed result is an array and each entry has string `id`, string `text`, boolean `completed`, and numeric `createdAt` — drop malformed entries.
2. [logic] Create `src/todos.js` — export pure, DOM-free named functions operating on immutable arrays: `createTodo(text)` returns a new todo `{ id, text, completed: false, createdAt }` where `id` is produced by `crypto.randomUUID()` and `createdAt` is `Date.now()`; it trims `text` and throws `Error("Todo text must not be empty")` if the trimmed string is empty or not a string. Export `addTodo(todos, text)` returning a new array with the new todo appended. Export `toggleTodo(todos, id)` returning a new array where the matching todo has `completed` flipped; if no id matches, return the original array reference. Export `deleteTodo(todos, id)` returning a new array with the matching todo removed; if no id matches, return the original array reference. None of these functions mutate their inputs.

---

#### Ticket 2: To-Do UI, Styling, and Wiring
**depends_on:** [Ticket 1]

> Rebuild the page as a responsive, minimalist To-Do application that wires user interactions to the Ticket 1 logic modules, persists changes via `localStorage`, and animates add/remove transitions.

**Constraints:**
- Use named exports in `src/app.js` (Biome `noDefaultExport` applies to `src/**`); the module is loaded via `<script type="module">` so no IIFE wrapper is needed.
- Do not duplicate storage or CRUD logic — import it from `src/storage.js` and `src/todos.js` as read-only collaborators; never modify those files from this ticket.
- Every interactive or display element (input, button, list, list item, filter, counter, empty state) must have a stable `data-testid` attribute.
- Styling uses CSS custom properties declared on `:root`; layout must be responsive at ≤480px, 481–768px, and >768px.
- Respect `@media (prefers-reduced-motion: reduce)` — disable all transform/opacity animations under that condition.
- Format must match Biome config: 2-space indent, double quotes, trailing commas, semicolons, 100-char line width.

**Files owned:**
- `src/app.js` (create)
- `src/index.html` (modify)
- `src/style.css` (modify)
- `tests/e2e/homepage.spec.ts` (delete)

**Tasks:**
1. [infra] Delete `tests/e2e/homepage.spec.ts` — this E2E spec asserts the "Hello World" heading and a linked stylesheet on the homepage, and is invalidated by the to-do rewrite. Verify the file no longer exists on disk and that no other source file imports or references it (Playwright will simply find no spec in that path).
2. [ui] Create `src/app.js` as an ES module — import `{ loadTodos, saveTodos }` from `./storage.js` and `{ addTodo, toggleTodo, deleteTodo }` from `./todos.js`. On `DOMContentLoaded`, initialize `state.todos = loadTodos()` and call `render()`. Expose a single `render()` function that: (a) queries `[data-testid="todo-list"]`, (b) renders one `<li data-testid="todo-item-{id}">` per todo containing a checkbox `[data-testid="todo-checkbox-{id}"]` (checked iff completed), the todo text `[data-testid="todo-text-{id}"]` (strike-through class `.todo--completed` when completed), and a delete button `[data-testid="todo-delete-{id}"]`, (c) updates `[data-testid="todo-count"]` to the number of active (not-completed) todos with label "N items left" (singular "1 item left"), (d) toggles visibility of `[data-testid="empty-state"]` when `state.todos.length === 0`, and (e) applies filter state to show All/Active/Completed todos. Wire a submit handler on `[data-testid="todo-form"]` that reads `[data-testid="todo-input"]`, calls `addTodo`, persists via `saveTodos`, clears the input, focuses the input, and re-renders; empty/whitespace input is ignored without throwing. Wire delegated click handlers on the list: checkbox toggle calls `toggleTodo`, delete button calls `deleteTodo`; both persist and re-render. Add transient CSS classes `.is-entering` (on newly added `<li>`) and `.is-leaving` (on items being removed) and remove the DOM node after a 200ms timeout when deleting so the leave animation plays. Wire the filter buttons `[data-testid="filter-all"]`, `[data-testid="filter-active"]`, `[data-testid="filter-completed"]` to update a `state.filter` ("all" | "active" | "completed") and re-render; the active filter button gets `aria-pressed="true"`. Keep all state in a single in-module `state` object — no globals on `window`.
3. [ui] Modify `src/index.html` — replace the `<h1>Hello World</h1>` body with the To-Do application markup. Update `<title>` to `"To-Do"`. Inside `<body>` render: a centered `<main data-testid="todo-app">` containing an `<h1>` heading reading "Todo", a `<form data-testid="todo-form">` wrapping `<input data-testid="todo-input" type="text" placeholder="What needs to be done?" autocomplete="off" maxlength="240" required>` and a submit `<button data-testid="todo-submit" type="submit" aria-label="Add todo">Add</button>`, a `<section data-testid="todo-filters">` containing three `<button>`s `[data-testid="filter-all"|"filter-active"|"filter-completed"]` with `type="button"` and `aria-pressed` attributes (default pressed on All), an `<ul data-testid="todo-list">` (initially empty — populated by `app.js`), a `<p data-testid="empty-state">` reading "Nothing to do yet — add your first task above.", and a `<footer data-testid="todo-footer">` containing `<span data-testid="todo-count">0 items left</span>`. Add `<script type="module" src="app.js"></script>` at the end of `<body>`. Keep the existing `<link rel="stylesheet" href="style.css" />` tag so the existing-stylesheet invariant is preserved.
4. [ui] Modify `src/style.css` — replace the current body rule with a full minimalist design system. Declare CSS custom properties on `:root` for `--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-danger`, `--radius`, `--space-1` through `--space-6`, `--transition-fast` (150ms), `--transition-base` (200ms), and a professional font stack (`-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif`). Apply `box-sizing: border-box` globally and reset default margins. Style `body` with the bg color, text color, and center `main` with `min-height: 100vh`, flex layout, padding. Style `main[data-testid="todo-app"]` as a centered card with `max-width: 560px`, white surface, subtle shadow, rounded corners. Style the form as a flex row with the input growing to fill; input has 1px border, rounded corners, focus ring using `--color-accent`. Submit button is solid accent with hover/active states using `transform: translateY(-1px)` and brightness shift, transitioned with `--transition-fast`. Style `[data-testid="todo-filters"]` as a centered row of pill buttons; active button uses `--color-accent` text and a subtle underline. Style `[data-testid="todo-list"]` items with bottom border separators, flex row layout (checkbox, text, delete), `padding: var(--space-3) 0`. `.todo--completed` applies `text-decoration: line-through` and `color: var(--color-text-muted)`. Checkbox is a custom-styled 20px round control. Delete button is icon-style, hidden by default (`opacity: 0`) and revealed on list-item hover/focus-within, colored `--color-danger` on hover. Style the empty state as centered muted text with generous vertical padding. Define keyframe animations: `@keyframes todo-enter` (from `opacity: 0; transform: translateY(-4px);` to `opacity: 1; transform: translateY(0);`) applied via `.is-entering` for 200ms; `@keyframes todo-leave` (opposite) applied via `.is-leaving` for 200ms. Add `@media (max-width: 480px)` overrides — reduce `main` padding, make the submit button full-width below the input (stacked form). Add `@media (min-width: 481px) and (max-width: 768px)` tuning if needed. Add `@media (prefers-reduced-motion: reduce)` block that sets `animation: none !important; transition: none !important;` on all elements.

---

> **Note:** A ticket is workable once all tickets in its `depends_on` list are complete — siblings under the same parent run in parallel. Tasks within each ticket are sequential. No ticket includes test creation — testing is handled separately.
