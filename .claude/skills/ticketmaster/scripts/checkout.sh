#!/usr/bin/env bash
set -euo pipefail

# Check if a ticket number was provided
if [ -z "$1" ]; then
  echo "Error: Ticket Number is required."
  echo "Usage: $0 <ticket-number>"
  exit 1
fi

TICKET="$1"
MAIN_BRANCH="maestro"
WORKFLOW_BRANCH="prd-${TICKET}"
REQ_BRANCH="${WORKFLOW_BRANCH}-requirements"

# Helper function to check if a branch exists locally
has_local_branch() {
    git rev-parse --verify --quiet "$1" > /dev/null 2>&1
}

# Helper function to check if a branch exists on remote
has_remote_branch() {
    git ls-remote --exit-code origin "refs/heads/$1" > /dev/null 2>&1
}

# Helper function to create a branch if it doesn't exist locally or remotely
checkout_branch() {
    local branch_name="$1"
    
    if has_local_branch "$branch_name"; then
        git checkout "$branch_name" || { echo "Failed to checkout $branch_name (local)"; exit 1; }
        git pull origin "$branch_name" || { echo "Failed to pull from origin/$branch_name"; exit 1; }
    elif has_remote_branch "$branch_name"; then
        git checkout -b "$branch_name" origin/"$branch_name" || { echo "Failed to checkout $branch_name (remote)"; exit 1; }
    else
        git checkout -b "$branch_name" || { echo "Failed to checkout $branch_name (new branch)"; exit 1; }
        git push -u origin "$branch_name" || { echo "Failed to push origin/$branch_name"; exit 1; }
    fi
}

# Checkout main
git checkout main || { echo "Failed to checkout main"; exit 1; }

# Fetch all branches and prune deleted ones
git fetch origin --prune || true

# Pull main
git pull origin main || true

# Create/checkout meaestro branch
checkout_branch "$MAIN_BRANCH"

# Create/checkout workflow branch
checkout_branch "$WORKFLOW_BRANCH"

# Create/checkout requirements branch
checkout_branch "$REQ_BRANCH"

echo "You are now on branch $(git branch --show-current). Proceed to next step to generate PRD."
