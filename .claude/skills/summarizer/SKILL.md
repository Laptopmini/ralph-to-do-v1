---
name: summarizer
description: >
  Generates a diff-based PR description and opens a pull request for a prd branch.
  Activated ONLY by the slash command "/summarizer" followed by three arguments:
  repository name, head branch, and base branch.
  Do NOT use this skill for any other phrasing. This skill is exclusively command-driven.
disable-model-invocation: true
---

# Summarizer Skill

Analyzes the diff between a PRD branch and a base branch, generates a professional PR description, and opens a pull request.

---

## Invocation

This skill is triggered exclusively by the slash command:

```
/summarizer <head-branch> <base-branch>
```

**Arguments (positional, in order):**

1. `<head-branch>` — The branch with changes (e.g., `prd-1`)
2. `<base-branch>` — The branch to diff against (e.g., `main`)

If the user types `/summarizer` with missing arguments, respond:

> "Please provide all two arguments. Example: `/summarizer prd-1 main`"

Do not run the workflow in that case.

---

## Workflow

### Step 0 — Parse and validate the command

Extract the two arguments from the user's message.

**Extract the ticket number:** Match the head branch name against the pattern `prd-([0-9]+)` and capture the digits as `<ticket-number>` (e.g. `prd-3` → `3`, `prd-3-requirements` → `3`). If the head branch does not match this pattern, there is no ticket number — do not exit; the conventional commit prefix in Step 3 will fall back to a default.

### Step 1 — Generate the diff

Run `git diff` between the base branch and the head branch:

```bash
git diff <base-branch>..<head-branch>
```

If the diff command fails or produces no output, exit with a non-zero exit code.

### Step 2 — Analyze the diff and generate the PR description

Given the diff output, perform the following analysis:

1. **Analyze the code changes** — understand what was added, modified, and removed
2. **Identify the key modifications** — group related changes together
3. **Extract scope, purpose, and impact** — determine what the changes accomplish and what areas of the codebase are affected
4. **Generate a professional PR description** with the following sections:

#### PR Description Format

The generated PR Description must follow this structure. Refer to `.claude/skills/summarizer/examples/sample.md` for a concrete example.

```markdown
## Summary

<A concise paragraph describing what this PR accomplishes and why.>

## Changes Made

<Bulleted list of key changes, grouped logically. Each bullet should describe a meaningful change, not just list files.>

## Impacted Files

<Bulleted list of all files that were added, modified, or deleted, with a short note about what changed in each.>
```

Also generate a short, descriptive **Title** for the PR (under 60 characters, no prefix — the prefix is added automatically).

Write the PR description to `.maestro.summary.md`:

```bash
cat > .maestro.summary.md << 'PRBODYEOF'
<pr-description>
PRBODYEOF
```

### Step 3 — Open the pull request

**Determine the conventional-commit prefix:**
- If `<ticket-number>` was extracted in Step 0, use `feat(<ticket-number>)` (e.g. `feat(1)`).
- Otherwise, use `feat(ai)`.

This value is `<commit-prefix>` below.

Run the helper script:

```bash
bash .claude/skills/summarizer/scripts/open-pr.sh <head-branch> <base-branch> "<commit-prefix>: <title>"
```

Where:
- `<head-branch>` is the first argument (e.g., `prd-1`)
- `<base-branch>` is the second argument (e.g., `main`)
- `<commit-prefix>` is `feat(<ticket-number>)` when a ticket number was extracted, otherwise `feat(ai)`
- `<title>` is the generated PR title (e.g., `Timer Logic Module`)

If the script fails, exit with a non-zero exit code.

---

## Example

Given the command:

```
/summarizer prd-1 main
```

The skill would:

1. Match `prd-1` against `prd-([0-9]+)` and extract ticket number `1`
2. Run `git diff main..prd-1`
3. Analyze the diff and generate:
   - **Title**: `Timer Logic Module`
   - **Summary**: description of the changes
   - **Changes Made**: bulleted list of key modifications
   - **Impacted Files**: list of affected files
4. Write the PR description to `.maestro.summary.md`
5. Determine the commit prefix: `feat(1)` (since a ticket number was extracted)
6. Run `bash .claude/skills/summarizer/scripts/open-pr.sh prd-1 main "feat(1): Timer Logic Module"`

---

## Error Handling

Exit with a non-zero exit code if any of the following occur:

- Missing or insufficient arguments
- `git diff` fails or produces empty output
- `gh pr create` fails
