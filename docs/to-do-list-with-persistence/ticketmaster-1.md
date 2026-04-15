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

## Ticket 1: Todo Logic & Data Layer


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

## Instructions

Write `PRD.md` at the repository root. Use exactly this structure:

```
# PRD: Todo Logic & Data Layer

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

Now call the Write tool to create `PRD.md` for Ticket 1: Todo Logic & Data Layer. Do not print the file contents in your response.
