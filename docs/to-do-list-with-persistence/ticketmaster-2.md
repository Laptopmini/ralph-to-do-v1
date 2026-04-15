You are a PRD generator. Your single task is to create a file called `PRD.md` at the root of the repository by calling the Write tool.

You will be given context from an implementation plan and one ticket to convert into a PRD. Call the Write tool with `file_path` = `PRD.md` and the PRD body as `content`. Do not print the PRD contents in your chat response. Do not wrap the PRD in a markdown code block in your response. Do not create any other files. Do not run any commands.

---

## Project Context

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

## Ticket 2: UI, Styling & Page Assembly


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

---

## Instructions

Write `PRD.md` at the repository root. Use exactly this structure:

```
# PRD: UI, Styling & Page Assembly

## Objective

<One paragraph describing what this ticket accomplishes. Derive it from the ticket description above.>

## Context

<Relevant background from the Project Context section above. Include only what helps a junior developer understand why this work matters and how it fits into the project. Do not copy the entire context — select what is relevant to this ticket.>

## Constraints

<Bullet list of constraints from the ticket. If the ticket has no constraints, write: "No additional constraints beyond the project defaults.">

## Tasks

<Task checklist — see Task Format below>
```

## Task Format

Convert each numbered task from the ticket into a checklist line:

```
- [ ] <Short title>. <Detailed description — specific enough for a junior developer who has no other context.> `[test: <test-command>]`
```

Rules:
- Each task MUST be a single line (no line breaks within a task)
- Each task MUST end with a `[test: ...]` annotation
- Write tasks clearly for a junior developer — spell out exactly what to create, modify, or configure

### Deriving the test command

Each task in the ticket has a nature tag: `[logic]`, `[ui]`, or `[infra]`.

**Step 1** — Derive a filename from the task's short title:
- Convert to kebab-case
- Remove articles (a, an, the) and punctuation

Example: "Add a banner at the top" → `add-banner-top`

**Step 2** — Map the nature tag to a test command:

| Tag | Test command |
|-----|-------------|
| `[logic]` | `npx jest tests/unit/<filename>.test.ts` |
| `[ui]` | `npx playwright test tests/e2e/<filename>.spec.ts` |
| `[infra]` | `npx tsc --noEmit` or `npx biome check` for config validation; `bash scripts/<filename>.sh` otherwise |

---

## Example

Given a ticket section like this (input):

    > Implement and unit-test the pure countdown logic.
    >
    > **Constraints:**
    > - Must be a TypeScript module importable by Jest
    > - No DOM or browser APIs
    >
    > **Tasks:**
    > 1. [logic] Create `src/timer-logic.ts` with pure functions: `formatTime` and `tick`
    > 2. [logic] Create unit tests for timer logic

…the Write tool call's `content` argument should be the following text (shown indented here for illustration — do NOT indent it in the actual file, and do NOT wrap it in backticks):

    # PRD: Timer Logic (Pure Functions)

    ## Objective

    Implement and unit-test the pure countdown logic, providing formatTime and tick as pure TypeScript functions that can be imported and tested with Jest.

    ## Context

    The project uses TypeScript with Jest for unit testing. No application source code exists yet — this ticket establishes the first module. Dependencies are already installed via npm.

    ## Constraints

    - Must be a TypeScript module importable by Jest
    - No DOM or browser APIs

    ## Tasks

    - [ ] Create timer logic module. Create `src/timer-logic.ts` with pure functions: `formatTime(totalSeconds: number): string` (returns "MM:SS") and `tick(remainingSeconds: number): number` (decrements by 1, floors at 0), and a constant `POMODORO_DURATION_SECONDS = 1500`. `[test: npx jest tests/unit/create-timer-logic-module.test.ts]`
    - [ ] Create timer logic unit tests. Create `tests/unit/timer-logic.test.ts` — test `formatTime` (25:00, 00:00, 09:59 edge cases), test `tick` (decrements, does not go below 0), test duration constant equals 1500. `[test: npx jest tests/unit/create-timer-logic-unit-tests.test.ts]`

---

Now call the Write tool to create `PRD.md` for Ticket 2: UI, Styling & Page Assembly. Do not print the file contents in your response.
