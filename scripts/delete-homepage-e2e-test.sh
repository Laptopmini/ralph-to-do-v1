#!/usr/bin/env bash
set -euo pipefail

# Task: Verify that tests/e2e/homepage.spec.ts has been deleted
# and no other source files reference it.

FAIL=0

# 1. The file must not exist
if [ -f "tests/e2e/homepage.spec.ts" ]; then
  echo "FAIL: tests/e2e/homepage.spec.ts still exists"
  FAIL=1
else
  echo "PASS: tests/e2e/homepage.spec.ts has been deleted"
fi

# 2. No other source files should reference homepage.spec.ts
# Search src/ and tests/ for references (excluding this script itself)
REFS=$(grep -rl "homepage.spec.ts" src/ tests/ scripts/ 2>/dev/null | grep -v "delete-homepage-e2e-test.sh" || true)
if [ -n "$REFS" ]; then
  echo "FAIL: The following files still reference homepage.spec.ts:"
  echo "$REFS"
  FAIL=1
else
  echo "PASS: No source files reference homepage.spec.ts"
fi

if [ "$FAIL" -ne 0 ]; then
  exit 1
fi

echo "All checks passed."
exit 0
