#!/usr/bin/env bash
set -euo pipefail

# Task: Verify build pipeline configuration in package.json
# 1. "build" script exists and compiles TS to JS in src/
# 2. "start" script runs build before serve
# 3. src/*.js and src/*.js.map are in .gitignore

FAIL=0

# Check package.json exists
if [ ! -f "package.json" ]; then
  echo "FAIL: package.json not found"
  exit 1
fi

# 1. Check "build" script exists and contains tsc
BUILD_SCRIPT=$(node -e "const p = require('./package.json'); console.log(p.scripts?.build || '')")
if [ -z "$BUILD_SCRIPT" ]; then
  echo "FAIL: No 'build' script found in package.json"
  FAIL=1
elif ! echo "$BUILD_SCRIPT" | grep -q "tsc"; then
  echo "FAIL: 'build' script does not use tsc"
  FAIL=1
else
  echo "PASS: 'build' script exists and uses tsc"
fi

# Check build script targets src/ output
if echo "$BUILD_SCRIPT" | grep -q -- "--outDir src\|--outDir ./src"; then
  echo "PASS: 'build' script outputs to src/"
else
  echo "FAIL: 'build' script does not output to src/"
  FAIL=1
fi

# 2. Check "start" script runs build first
START_SCRIPT=$(node -e "const p = require('./package.json'); console.log(p.scripts?.start || '')")
if ! echo "$START_SCRIPT" | grep -q "npm run build"; then
  echo "FAIL: 'start' script does not run 'npm run build'"
  FAIL=1
else
  echo "PASS: 'start' script runs build before serve"
fi

if ! echo "$START_SCRIPT" | grep -q "serve"; then
  echo "FAIL: 'start' script does not include serve"
  FAIL=1
else
  echo "PASS: 'start' script includes serve"
fi

# 3. Check .gitignore includes src/*.js and src/*.js.map
if [ ! -f ".gitignore" ]; then
  echo "FAIL: .gitignore not found"
  FAIL=1
else
  if grep -q "src/\*\.js" .gitignore; then
    echo "PASS: .gitignore includes src/*.js"
  else
    echo "FAIL: .gitignore does not include src/*.js"
    FAIL=1
  fi

  if grep -q "src/\*\.js\.map" .gitignore; then
    echo "PASS: .gitignore includes src/*.js.map"
  else
    echo "FAIL: .gitignore does not include src/*.js.map"
    FAIL=1
  fi
fi

if [ "$FAIL" -ne 0 ]; then
  exit 1
fi

echo "All checks passed."
exit 0
