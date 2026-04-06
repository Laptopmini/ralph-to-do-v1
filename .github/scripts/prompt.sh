#!/bin/bash
# Usage: prompt.sh "<agent prompt>" [extra args...]
# Returns agent output on stdout. Narrates progress + echoes agent output on stderr.
# 
# Exit codes:
#   0  = success
#   2  = rate limit / quota / credit exhausted  (caller may want to back off long)
#   1  = other engine failure                   (caller may want to retry short)


set -euo pipefail

ENGINE="${ENGINE:-claude}"

AGENT_PROMPT="$1"
shift
EXTRA_ARGS=("$@")

echo "🟡 Handing control to $ENGINE..." >&2

set +e
if [[ "$ENGINE" == "claude" ]]; then
    OUTPUT=$(claude -p "$AGENT_PROMPT" "${EXTRA_ARGS[@]}" 2>&1 | tee /dev/stderr)
    ENGINE_EXIT=${PIPESTATUS[0]}
else
    OUTPUT=$(opencode run "$AGENT_PROMPT" "${EXTRA_ARGS[@]}" 2>&1 | tee /dev/stderr)
    ENGINE_EXIT=${PIPESTATUS[0]}
fi
set -e

if [[ "$ENGINE" == "claude" ]]; then
    if [[ "$OUTPUT" == *"rate_limit_error"* ]] || \
       [[ "$OUTPUT" == *"insufficient_quota"* ]] || \
       [[ "$OUTPUT" == *"credit balance"* ]]; then
        echo "🟠 Claude rate limit exceeded." >&2
        exit 2
    fi
fi

if [[ $ENGINE_EXIT -ne 0 ]]; then
    echo "🟠 Engine exited with code $ENGINE_EXIT." >&2
    exit 1
fi

echo "$OUTPUT"
