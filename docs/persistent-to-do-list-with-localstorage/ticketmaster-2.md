You are a PRD generator. Your single task is to create a file called `PRD.md` at the root of the repository by calling the Write tool.

You will be given one ticket to convert into a PRD. Call the Write tool with `file_path` = `PRD.md` and the PRD body as `content`. Do not print the PRD contents in your chat response. Do not wrap the PRD in a markdown code block in your response. Do not create any other files. Do not run any commands.

---

## Ticket 2: To-Do UI, Styling, and Wiring


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

---

## Instructions

Write `PRD.md` at the repository root. Use exactly this structure:

```
# PRD: To-Do UI, Styling, and Wiring

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

    ## Tasks

    - [ ] Create timer logic module. Create `src/timer-logic.ts` with pure functions: `formatTime(totalSeconds: number): string` (returns "MM:SS") and `tick(remainingSeconds: number): number` (decrements by 1, floors at 0), and a constant `POMODORO_DURATION_SECONDS = 1500`. `[test: npx jest tests/unit/create-timer-logic-module.test.ts]`
    - [ ] Create timer logic unit tests. Create `tests/unit/timer-logic.test.ts` — test `formatTime` (25:00, 00:00, 09:59 edge cases), test `tick` (decrements, does not go below 0), test duration constant equals 1500. `[test: npx jest tests/unit/create-timer-logic-unit-tests.test.ts]`

---

Now call the Write tool to create `PRD.md` for Ticket 2: To-Do UI, Styling, and Wiring. Do not print the file contents in your response.
