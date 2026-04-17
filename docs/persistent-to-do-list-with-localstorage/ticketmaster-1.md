You are a PRD generator. Your single task is to create a file called `PRD.md` at the root of the repository by calling the Write tool.

You will be given one ticket to convert into a PRD. Call the Write tool with `file_path` = `PRD.md` and the PRD body as `content`. Do not print the PRD contents in your chat response. Do not wrap the PRD in a markdown code block in your response. Do not create any other files. Do not run any commands.

---

## Ticket 1: Storage & Todo Domain Logic


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

## Instructions

Write `PRD.md` at the repository root. Use exactly this structure:

```
# PRD: Storage & Todo Domain Logic

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

    ## Constraints

    - Must be a TypeScript module importable by Jest
    - No DOM or browser APIs

    ## Tasks

    - [ ] Create timer logic module. Create `src/timer-logic.ts` with pure functions: `formatTime(totalSeconds: number): string` (returns "MM:SS") and `tick(remainingSeconds: number): number` (decrements by 1, floors at 0), and a constant `POMODORO_DURATION_SECONDS = 1500`. `[test: npx jest tests/unit/create-timer-logic-module.test.ts]`
    - [ ] Create timer logic unit tests. Create `tests/unit/timer-logic.test.ts` — test `formatTime` (25:00, 00:00, 09:59 edge cases), test `tick` (decrements, does not go below 0), test duration constant equals 1500. `[test: npx jest tests/unit/create-timer-logic-unit-tests.test.ts]`

---

Now call the Write tool to create `PRD.md` for Ticket 1: Storage & Todo Domain Logic. Do not print the file contents in your response.
