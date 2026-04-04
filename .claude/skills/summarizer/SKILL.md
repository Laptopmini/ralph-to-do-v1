---
name: summarizer
description: >
  Generates a diff-based PR description and opens a pull request for a prd branch.
  Activated ONLY by the slash command "/summarizer" followed by three arguments:
  repository name, current branch, and base branch.
  Do NOT use this skill for any other phrasing. This skill is exclusively command-driven.
disable-model-invocation: true
---

# Summarizer Skill

Analyzes the diff between a PRD branch and a base branch, generates a professional PR description, and opens a pull request.

---

## Invocation

This skill is triggered exclusively by the slash command:

```
/summarizer <repository> <current-branch> <base-branch>
```

**Arguments (positional, in order):**

1. `<repository>` — GitHub `owner/repo` slug (e.g., `Laptopmini/ralph-maestro-demo`)
2. `<current-branch>` — The branch with changes (e.g., `prd-1`)
3. `<base-branch>` — The branch to diff against (e.g., `main`)

If the user types `/summarizer` with missing arguments, respond:

> "Please provide all three arguments. Example: `/summarizer Laptopmini/ralph-maestro-demo prd-1 main`"

Do not run the workflow in that case.

---

## Workflow

### Step 0 — Parse and validate the command

Extract the three arguments from the user's message.

**Validate the current branch name:** It must start with `prd-`. If it does not, exit immediately with a non-zero exit code:

```bash
exit 1
```

**Extract the ticket number:** Take the portion of the branch name after `prd-`. For example, `prd-3` yields ticket number `3`. This is the `<ticket-number>` used in the PR title.

### Step 1 — Generate the diff

Run `git diff` between the base branch and the current branch:

```bash
git diff <base-branch>..<current-branch>
```

If the diff command fails or produces no output, exit with a non-zero exit code.

### Step 2 — Analyze the diff and generate the PR description

Given the diff output, perform the following analysis:

1. **Analyze the code changes** — understand what was added, modified, and removed
2. **Identify the key modifications** — group related changes together
3. **Extract scope, purpose, and impact** — determine what the changes accomplish and what areas of the codebase are affected
4. **Generate a professional PR description** with the following sections:

#### PR Description Format

```markdown
## Summary

<A concise paragraph describing what this PR accomplishes and why.>

## Changes Made

<Bulleted list of key changes, grouped logically. Each bullet should describe a meaningful change, not just list files.>

## Impacted Files

<Bulleted list of all files that were added, modified, or deleted, with a short note about what changed in each.>
```

Also generate a short, descriptive **Title** for the PR (under 60 characters, no prefix — the prefix is added automatically).

### Step 3 — Open the pull request

Use `gh pr create` to open the pull request:

```bash
gh pr create \
  --repo <repository> \
  --title "prd(<ticket-number>): <title>" \
  --body "<pr-description>" \
  --base <base-branch> \
  --head <current-branch>
```

Where:
- `<repository>` is the first argument (e.g., `Laptopmini/ralph-maestro-demo`)
- `<ticket-number>` is extracted from the branch name (e.g., `1`)
- `<title>` is the generated PR title (e.g., `Timer Logic Module`)
- `<pr-description>` is the full generated PR description from Step 2
- `<base-branch>` is the third argument (e.g., `main`)
- `<current-branch>` is the second argument (e.g., `prd-1`)

If `gh pr create` fails, exit with a non-zero exit code.

**Capture the PR number:** Extract the `<pr-number>` from the URL returned by `gh pr create`, or query it with:

```bash
gh pr view <current-branch> --repo <repository> --json number --jq .number
```

### Step 4 — Output result

Output ONLY the following line with no other text before or after it:

```
prd-<ticket-number> (#<pr-number>)
```

For example, ticket number 3 with PR number 12:

```
prd-3 (#12)
```

Do not output any other text. This output is consumed by a bash script and must be machine-readable.

If any step failed, exit with a non-zero exit code.

---

## Example

Given the command:

```
/summarizer Laptopmini/ralph-maestro-demo prd-1 main
```

The skill would:

1. Validate `prd-1` starts with `prd-` — pass
2. Extract ticket number `1`
3. Run `git diff main..prd-1`
4. Analyze the diff and generate:
   - **Title**: `Timer Logic Module`
   - **Summary**: description of the changes
   - **Changes Made**: bulleted list of key modifications
   - **Impacted Files**: list of affected files
5. Run `gh pr create --repo Laptopmini/ralph-maestro-demo --title "prd(1): Timer Logic Module" --body "..." --base main --head prd-1`
6. Extract PR number (e.g., `12`) from the created PR
7. Output `prd-1 (#12)`

---

## Error Handling

Exit with a non-zero exit code if any of the following occur:

- Missing or insufficient arguments
- Branch name does not start with `prd-`
- `git diff` fails or produces empty output
- `gh pr create` fails
