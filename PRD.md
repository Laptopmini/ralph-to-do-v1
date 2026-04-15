# PRD: UI, Styling & Page Assembly

## Objective

Deliver the complete user interface for the to-do list application by building the HTML structure, CSS styling, and DOM wiring that connects the UI to the logic layer from Ticket 1. This includes setting up the build pipeline to compile TypeScript modules for browser execution.

## Context

The project is a static vanilla HTML/CSS/TypeScript site served by `serve` with no JavaScript framework. The existing "Hello World" placeholder page will be fully replaced by the to-do list application. TypeScript must be compiled to JavaScript files that can be loaded via `<script>` tags in the browser. LocalStorage persists to-do items under the key `"todos"`.

Ticket 1 provides the pure logic module (`src/todo.ts`) with CRUD operations for to-do items. This ticket wires that logic to the DOM through `src/app.ts` and establishes the build pipeline so TypeScript compiles correctly.

## Constraints

- Use `data-testid` attributes on all interactive and display elements
- Imports from Ticket 1 files are read-only — do not modify files owned by Ticket 1
- The page must be responsive (mobile and desktop) using CSS media queries or fluid layout
- All interactivity is wired via `src/app.ts` which imports from `src/todo.ts`
- The compiled `.js` output must be loadable by the browser via `<script>` tags

## Tasks

- [ ] Delete homepage E2E test. Remove `tests/e2e/homepage.spec.ts` — this file tests "Hello World" text that will no longer exist; verify it is deleted and not referenced elsewhere `[test: npx tsc --noEmit]`
- [ ] Configure build pipeline in package.json. Add `"build": "tsc --outDir src --allowJs --declaration false --sourceMap false --module ES2022 --target ES2022 --moduleResolution bundler --strict --rootDir src --include src/todo.ts src/app.ts"` script and update `"start"` to `"npm run build && serve -s src -l 3000"`; add `src/*.js` and `src/*.js.map` to `.gitignore` if missing `[test: npx tsc --noEmit]`
- [ ] Create to-do list HTML structure. Replace `src/index.html` with a page containing title "To-Do List", heading with `data-testid="app-title"`, input field with `data-testid="todo-input"` (type text, placeholder "Add a new task..."), add button with `data-testid="add-task-btn"`, list container with `data-testid="todo-list"`, empty state message with `data-testid="empty-state"` reading "No tasks yet. Add one above!", and `<script type="module" src="app.js"></script>` at end of body `[test: npx playwright test tests/e2e/ui-create-html-structure.spec.ts]`
- [ ] Implement to-do app CSS styles. Replace `src/style.css` with a clean, modern, minimalist design featuring centered container (max-width 600px, auto margins), system-ui font family, full-width input field with 12px padding and border-radius 8px, blue "Add Task" button (#2563eb background, hover #1d4ed8) with 12px 24px padding, flex-row list items with checkbox left/text center/delete right, completed tasks with line-through and opacity 0.6, red delete buttons (#dc2626 background, hover #b91c1c), responsive stacking on screens narrower than 480px, box-shadow on container, and smooth transitions `[test: npx playwright test tests/e2e/ui-implement-css-styles.spec.ts]`
- [ ] Implement DOM wiring in app.ts. Create `src/app.ts` that imports from `./todo.js`, loads initial todos from LocalStorage via `loadTodos()`, implements `render(todos: Todo[])` function that creates list items with `data-testid="todo-item-{id}"` containing checkbox (`data-testid="todo-checkbox-{id}"`), text span (`data-testid="todo-text-{id}"`), and delete button (`data-testid="todo-delete-{id}"`), attaches click handlers for add-task button (calls `addTodo`, saves, clears input, re-renders) and Enter keypress in input, uses delegated handlers for checkboxes (call `toggleTodo`, save, re-render) and delete buttons (call `deleteTodo`, save, re-render), shows/hides empty state based on list emptiness, and calls render on initial load `[test: npx playwright test tests/e2e/ui-implement-dom-wiring.spec.ts]`
