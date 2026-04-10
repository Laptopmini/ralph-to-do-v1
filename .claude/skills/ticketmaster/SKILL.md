---
name: ticketmaster
description: >
  Takes a path to a markdown implementation plan and, for each ticket in that file, generates a PRD.md and pushes it out.
  Activated ONLY by the slash command "/ticketmaster" followed by a file path argument.
  Do NOT use this skill for any other phrasing. This skill is exclusively command-driven.
disable-model-invocation: true
---

# Ticketmaster Skill

**Important: Use extended thinking for this skill.** Before executing any step, think deeply about the implementation plan structure, the ticket contents, and how to generate clear PRD task lines. Extended thinking is required to produce high-quality, unambiguous PRDs for junior developers.

Converts an implementation plan into per-ticket branches, PRD files, and pull requests. **Process every ticket in the file you are given — no more, no fewer.** The caller is responsible for ensuring the file contains exactly the tickets to be processed.

---

## Invocation

This skill is triggered exclusively by the slash command:

```
/ticketmaster <path-to-implementation-plan.md>
```

If the user types `/ticketmaster` with no path argument, respond:

> "Please provide a path to an implementation plan. Example: `/ticketmaster .claude/skills/blueprint/examples/sample.md`"

Do not run the workflow.

---

## Workflow

### Step 0 — Parse the command

Extract `<file-path>` from the user's message (everything after `/ticketmaster `). If it is missing, respond with the error message from the **Invocation** section and stop. Read the file at `<file-path>`. If the file does not exist or is empty, tell the user and stop.

### Step 1 — Parse the implementation plan

Read the markdown file at the given path. Parse every `#### Ticket N: ...` section in the file — extract the description, constraints, files owned, and tasks for each. Also extract plan-level context (the `Assumptions` section, the `Tech Stack & Architecture Notes` section, and any other top-level context) — this applies to all processed tickets.

The ordinal `N` from the `#### Ticket N:` heading is the `<ticket-number>` used in branch names and PR titles. Note that the file may contain a non-contiguous subset of ordinals (e.g. only Ticket 3) — preserve whatever ordinal appears in the heading.

### Step 2 — Process tickets sequentially

Iterate over every parsed ticket in ascending order. Do **not** process tickets in parallel — each ticket involves git operations that must complete before the next begins.

#### 2a — Checkout branch

Run the checkout script with the ticket number to ensure the repo is in the correct state:

```bash
bash .claude/skills/ticketmaster/scripts/checkout.sh <ticket-number>
```

#### 2b — Generate PRD.md

Create a file called `PRD.md` at the root of the repository. Follow the PRD format described below in the **PRD Format** section.

#### 2c — Push the generated PRD

Run the push script with the ticket number and ticket title to commit the PRD:

```bash
bash .claude/skills/ticketmaster/scripts/push-changes.sh <ticket-number> "<ticket-title>"
```

Where `<ticket-title>` is the text after `#### Ticket N:` in the plan heading.

---

## PRD Format

The generated `PRD.md` must follow this structure. Refer to `.claude/skills/ticketmaster/examples/sample.md` for a concrete example.

```markdown
# PRD: <Ticket Name>

## Objective

<A clear, concise paragraph describing what this ticket accomplishes, derived from the ticket's description line.>

## Context

<Relevant context pulled from the implementation plan's top-level sections: assumptions, tech stack notes, relevant existing patterns, and recommendations. Include only what is relevant to this specific ticket. This section should give a junior developer enough background to understand why this work matters and how it fits into the broader project.>

## Constraints

<Bullet list of constraints from the ticket's Constraints section. If the ticket has no constraints, state "No additional constraints beyond the project defaults.">

## Tasks

- [ ] <Task line 1> `[test: <test-command>]`
- [ ] <Task line 2> `[test: <test-command>]`
...
```

### Task line rules

Each task must be a **single line** in the format:

```
- [ ] <Short title>. <Description of what to do, specific enough for a junior developer.> `[test: <test-command>]`
```

These PRDs will be handled by a junior developer, so write them clearly and without ambiguity. Spell out exactly what to create, modify, or configure. Do not assume the reader has context beyond what is in the PRD itself.

### Determining the test command

Each task in the implementation plan has a nature tag: `[logic]`, `[ui]`, or `[infra]`.

**Derive the test filename** from the task's short title:
1. Take the short title (the text before the first period in the task line).
2. Convert to kebab-case.
3. Remove articles (a, an, the) and punctuation.

Example: "Add a banner at the top" becomes `add-banner-top`.

**Map the nature tag to a test command:**

| Nature tag | Test command template |
|------------|----------------------|
| `[logic]`  | `npx jest tests/unit/<filename>.test.ts` |
| `[ui]`     | `npx playwright test tests/e2e/<filename>.spec.ts` |
| `[infra]`  | `bash scripts/<filename>.sh` — unless the task is a config validation, in which case use the relevant CLI command directly (e.g., `npx tsc --noEmit`, `npx biome check`, etc.) |

---

## Example

Given an implementation plan with:

```markdown
#### Ticket 1: Timer Logic (Pure Functions)

> Implement and unit-test the pure countdown logic.

**Constraints:**
- Must be a TypeScript module importable by Jest
- No DOM or browser APIs

**Tasks:**
1. [logic] Create `src/timer-logic.ts` with pure functions: `formatTime` and `tick`
2. [logic] Create unit tests for timer logic
```

The skill would:
1. Run `bash .claude/skills/ticketmaster/scripts/checkout.sh 1` to checkout the correct branch
2. Generate `PRD.md` with:
   - **Objective**: based on "Implement and unit-test the pure countdown logic"
   - **Context**: pulled from the plan's assumptions and tech stack notes
   - **Constraints**: "Must be a TypeScript module importable by Jest", "No DOM or browser APIs"
   - **Tasks**:
     - `- [ ] Create timer logic module. Create src/timer-logic.ts with pure functions: formatTime(totalSeconds: number): string (returns "MM:SS") and tick(remainingSeconds: number): number (decrements by 1, floors at 0), and a constant POMODORO_DURATION_SECONDS = 1500. [test: npx jest tests/unit/create-timer-logic-module.test.ts]`
     - `- [ ] Create timer logic unit tests. Create tests/unit/timer-logic.test.ts — test formatTime (25:00, 00:00, 09:59 edge cases), test tick (decrements, does not go below 0), test duration constant equals 1500. [test: npx jest tests/unit/create-timer-logic-unit-tests.test.ts]`
3. Run `bash .claude/skills/ticketmaster/scripts/push-changes.sh 1 "Timer Logic (Pure Functions)"` to push the PRD

---

## Quality Checklist

Before generating each PRD, verify:

- [ ] Every task is on a single line
- [ ] Every task has a `[test: ...]` annotation
- [ ] Test filenames are derived from the task's short title in kebab-case
- [ ] The correct test runner is used based on the nature tag
- [ ] Context section includes only information relevant to this specific ticket
- [ ] Constraints are copied faithfully from the implementation plan
- [ ] The PRD is written clearly enough for a junior developer to follow without external context
