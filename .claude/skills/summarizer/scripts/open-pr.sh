#!/usr/bin/env bash

set -euo pipefail

source .github/scripts/log.sh

if [ "$#" -ne 3 ]; then
    echo "Missing arguments. Usage: $0 <head_branch> <base_branch> <pr_title>"
    exit 1
fi

HEAD_BRANCH=$1
BASE_BRANCH=$2
PR_TITLE=$3
BODY_FILE=".maestro.summary.md"

# Check if the body file exists
if [ ! -f "$BODY_FILE" ]; then
    echo "Error: You need to write a PR description to $BODY_FILE and try again."
    exit 1
fi

# Get the repo slug
REPO_SLUG=$(bash .github/scripts/repo-slug.sh)
if [ -z "$REPO_SLUG" ]; then
    echo "Error: Failed to retrieve REPO_SLUG. Abort your task and inform user."
    exit 1
fi

# Create the PR
PR_URL=$(gh pr create \
    --repo "$REPO_SLUG" \
    --head "$HEAD_BRANCH" \
    --base "$BASE_BRANCH" \
    --title "$PR_TITLE" \
    --body-file "$BODY_FILE")

# Extract PR number from the URL (e.g., .../pull/123 -> 123)
PR_NUMBER=$(echo "$PR_URL" | grep -oE '[0-9]+$')

# Delete the summary file
rm "$BODY_FILE"

# Output the PR number to the .maestro.pull-requests.tsv file
printf '%s\t%s\n' "$BASE_BRANCH" "$PR_NUMBER" >> .maestro.pull-requests.tsv
