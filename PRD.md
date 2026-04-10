# PRD: UI, Styling & Page Assembly

## Objective

Create the to-do list user interface by replacing the "Hello World" placeholder with a fully functional to-do app page structure, styling, and DOM wiring that connects the UI to the logic module from Ticket 1.

## Context

- **Detected stack:** Static HTML/CSS/TypeScript served by `serve` (no framework)
- **Existing patterns:** Single-page app in `src/` with `index.html`, `style.css`, and TypeScript files; Jest unit tests in `tests/unit/`; Playwright E2E tests in `tests/e2e/`
- **Build pipeline:** The app uses SWC for Jest testing, but the browser needs compiled JavaScript. A `build` script using `tsc` must compile TypeScript to JavaScript output alongside `.ts` files so they can be loaded via `<script>` tags
- **Local storage:** To-do items are persisted in LocalStorage under key `"todos"` as a JSON-serialized array
- **Dependencies:** Ticket 1 provides the pure logic module (`src/todo.ts`) with CRUD operations — this ticket imports those functions read-only

## Constraints

- Use `data-testid` attributes on all interactive and display elements
- Imports from Ticket 1 files are read-only — do not modify files owned by Ticket 1
- The page must be responsive (mobile and desktop) using CSS media queries or fluid layout
- All interactivity is wired via `src/app.ts` which imports from `src/todo.ts`
- The compiled `.js` output must be loadable by the browser via `<script>` tags

## Tasks

- [ ] Delete homepage E2E test. Remove `tests/e2e/homepage.spec.ts` since it tests "Hello World" text that will no longer exist after replacing the page with the to-do app. Verify the file is deleted and no other source files reference it `[test: bash scripts/delete-homepage-e2e-test.sh]`

- [ ] Configure build pipeline in package.json. Modify `package.json` to add a `"build": "tsc --outDir src --allowJs --declaration false --sourceMap false --module ES2022 --target ES2022 --moduleResolution bundler --strict --rootDir src --include src/todo.ts src/app.ts"` script that compiles only `src/todo.ts` and `src/app.ts` to `.js` files in `src/`. Update `"start"` to `"npm run build && serve -s src -l 3000"`. Add `src/*.js` and `src/*.js.map` to `.gitignore` if not already present `[test: bash scripts/configure-build-pipeline.sh]`

- [ ] Create to-do app HTML structure. Replace the contents of `src/index.html` with a complete to-do list page containing: a `<title>` element reading "To-Do List", an `<h1>` heading with `data-testid="app-title"` reading "To-Do List", an input field with `data-testid="todo-input"`, type="text", and placeholder="Add a new task...", an "Add Task" button with `data-testid="add-task-btn"`, a container div with `data-testid="todo-list"` for rendering items, and an empty-state message with `data-testid="empty-state"` reading "No tasks yet. Add one above!" when the list is empty. Include `<link rel="stylesheet" href="style.css">` in the `<head>`, proper `<meta charset>` and `<meta name="viewport">` tags, and `<script type="module" src="app.js"></script>` at the end of `<body>` `[test: npx playwright test tests/e2e/create-todo-app-html-structure.spec.ts]`

- [ ] Style to-do app with modern responsive design. Replace `src/style.css` contents with a clean, minimalist design featuring: centered app container (max-width 600px, auto margins), `system-ui, sans-serif` font family, full-width input field with 12px padding, 1px solid #ddd border, and 8px border-radius, "Add Task" button with background color #2563eb, white text, 12px 24px padding, 8px border-radius, hover state #1d4ed8, to-do items as flex rows (checkbox left, text center with flex-grow, delete button right), completed tasks with `text-decoration: line-through` and `opacity: 0.6`, delete button in red (#dc2626) with hover state (#b91c1c), responsive styles for screens under 480px (reduced padding, stacked input/button layout), subtle box-shadow on app container, and smooth transitions on interactive elements `[test: npx playwright test tests/e2e/style-todo-app-responsive-design.spec.ts]`

- [ ] Implement DOM wiring in app.ts. Create `src/app.ts` that imports `loadTodos`, `saveTodos`, `addTodo`, `toggleTodo`, `deleteTodo` from `./todo.js` on module load. On `DOMContentLoaded`: call `loadTodos()` to get initial items, implement a `render(todos: Todo[])` function that clears the `todo-list` container, shows/hides `empty-state` based on list emptiness, creates list items (`data-testid="todo-item-{id}"`) with checkbox (`data-testid="todo-checkbox-{id}"`, checked if completed), text span (`data-testid="todo-text-{id}"` with `.completed` class when done), and delete button (`data-testid="todo-delete-{id}"` reading "Delete"), attach click handler to "Add Task" button that reads input, calls `addTodo`, saves via `saveTodos`, clears input, and re-renders, trigger add on Enter keypress in input field, use delegated click handlers for checkboxes (call `toggleTodo`, save, re-render) and delete buttons (call `deleteTodo`, save, re-render), call initial render `[test: npx playwright test tests/e2e/implement-dom-wiring-app-ts.spec.ts]`
