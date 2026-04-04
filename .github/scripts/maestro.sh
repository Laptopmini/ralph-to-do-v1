#!/bin/bash

# ==============================================================================
# MAESTRO: Automate the entire process
# Usage: ./maestro.sh
# ==============================================================================

set -euo pipefail

# Settings
LOCK_FILE=".maestro.lock"
LOG_FILE=".maestro.log"
BLUEPRINT_FILE=".maestro.blueprint.md"
ENGINE="claude" # FIXME: Use env variable `ENGINE` with default value `claude`

# Functions

prompt() {
    # FIXME: Make this a reusable script which can be called from other scripts
    local AGENT_PROMPT="$1"
    shift
    local EXTRA_ARGS="$@"

    echo "🟡 Handing control to $ENGINE..."  >&2
    local OUTPUT=""
    local ENGINE_EXIT=0
    if [[ "$ENGINE" == "claude" ]]; then
        set +e
        OUTPUT=$(claude -p "$AGENT_PROMPT" $EXTRA_ARGS)
        ENGINE_EXIT=$?
        set -e

        if [[ "$OUTPUT" == *"rate_limit_error"* ]] || [[ "$OUTPUT" == *"insufficient_quota"* ]] || [[ "$OUTPUT" == *"credit balance"* ]]; then
            echo "🟠 Claude rate limit exceeded." >&2
            exit 1
        fi
    else
        set +e
        OUTPUT=$(opencode run "$AGENT_PROMPT" $EXTRA_ARGS)
        ENGINE_EXIT=$?
        set -e
    fi

    if [[ $ENGINE_EXIT -ne 0 ]]; then
        echo "🟠 Engine exited with code $ENGINE_EXIT." >&2
        exit 1
    fi

    echo "$OUTPUT"
    return 0
}

open_pull_requests() {
    read -n 1 -s -r -p "💬 Are you ready to review the Pull Requests? Press any key to open in browser..."
    open $(gh repo view --json url -q ".url + \"/pulls\"")
}

review_pull_requests() {
    # FIXME: Could have Claude do an initial review of the PRs to improve user's review/approval
    open_pull_requests
    read -n 1 -s -r -p "💬 Once all Pull Requests have been merged, press any key to continue..."

    local UNVERIFIED=true
    while $UNVERIFIED; do
        local ALL_MERGED=true
        while IFS= read -r line; do
            local PR_NUMBER=$(echo "$line" | grep -oP '(?<=#)\d+(?=\)$)')
            
            if [ -z "$PR_NUMBER" ]; then
                # Unable to extract PR number from line
                ALL_MERGED=false
                break
            fi

            local state=$(gh pr view "$PR_NUMBER" --json state --jq '.state')
            
            if [ "$state" != "MERGED" ]; then
                ALL_MERGED=false
                break
            fi

            # Clean up the local branch
            local BRANCH_NAME=$(gh pr view "$PR_NUMBER" --repo Laptopmini/ralph-maestro-demo --json headRefName --jq '.headRefName')
            git branch -D "$BRANCH_NAME" || true
        done <<< "$1"

        if [ "$ALL_MERGED" = false ]; then
            read -n 1 -s -r -p "💬 Are you sure all Pull Requests have been merged? Press any key to continue when ready..."
        else
            UNVERIFIED=false
        fi
    done
}

# ==============================================================================

if [ -e "$LOCK_FILE" ]; then
    echo "❌ Error: Maestro is already running! Exiting..."
    exit 1
fi

touch "$LOCK_FILE"
trap "rm -f $LOCK_FILE $BLUEPRINT_FILE" EXIT

if ! command -v $ENGINE &> /dev/null; then
    echo "❌ Error: $ENGINE CLI is not installed."
    exit 1
fi

if [ -z "$*" ]; then
    echo "❌ Error: No feature(s) request paragraph/description provided."
    echo "Usage: $0 [MAX_LOOPS] [--engine claude|opencode]"
    exit 1
fi

echo "🟢 Beginning orchestration..."

MISSING_BLUEPRINT=true;
while $MISSING_BLUEPRINT; do
    echo "⚪️ Generating implementation plan blueprint..."
    prompt "/blueprint $*" --model claude-opus-4-6 > $BLUEPRINT_FILE

    if command -v code &>/dev/null; then
        code $BLUEPRINT_FILE
    fi

    read -p "💬 Does the blueprint look accurate to you to proceed with generating PRD(s) for it? (Y/n): " -r confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        MISSING_BLUEPRINT=false
    else
        rm -f $BLUEPRINT_FILE
    fi
done

echo "⚪️ Generating PRD(s)..."
BRANCHES=$(prompt "/ticketmaster $BLUEPRINT_FILE" --model claude-sonnet-4-6)

review_pull_requests "$BRANCHES"

echo "⚪️ Generating backpressure for PRD(s)..."
REPO_SLUG=$(bash .claude/skills/ticketmaster/scripts/repo-slug.sh) # FIXME: This script shouldnt be nested in this skill if used outside of it
BACKPRESSURE_BRANCHES=""
while IFS= read -r line; do
    BASE_BRANCH_NAME="${line%% (*}"
    BACKPRESSURE_BRANCH_NAME="$BASE_BRANCH_NAME-backpressure"

    git checkout "$BASE_BRANCH_NAME" && git pull
    git checkout -b "$BACKPRESSURE_BRANCH_NAME"
    nvm use && npm i && npm run backpressure
    git add .
    git commit -m "chore(ai): Backpressure"
    git push -u origin "$BACKPRESSURE_BRANCH_NAME"
    BS_OUTPUT=$(prompt "/summarizer $REPO_SLUG $BACKPRESSURE_BRANCH_NAME $BASE_BRANCH_NAME" --model claude-haiku-4-5)
    [ -n "$BACKPRESSURE_BRANCHES" ] && BACKPRESSURE_BRANCHES+=$'\n'
    BACKPRESSURE_BRANCHES+="$BS_OUTPUT"
done <<< "$BRANCHES"

review_pull_requests "$BACKPRESSURE_BRANCHES"

echo "⚪️ Proceeding with implementation of PRD(s)..."
while IFS= read -r line; do
    BASE_BRANCH_NAME="${line%% (*}"

    git checkout "$BASE_BRANCH_NAME" && git pull
    nvm use && npm i && npm run ralph
    git add .
    git commit -m "chore(ai): Update Ralph log"
    git push -u origin "$BASE_BRANCH_NAME"
    prompt "/summarizer $REPO_SLUG $BASE_BRANCH_NAME main" --model claude-haiku-4-5
done <<< "$BACKPRESSURE_BRANCHES"

open_pull_requests

# FIXME: Add sample output to summarizer skill

git checkout main

echo "✅ Done!."