#!/usr/bin/env bash

# The point of this script is to demonstrate the underlying models' true capabilities if the given prompt wasn't fed through the maestro orchestration.
# Essentially answering the question "How different would the outcome be if you just asked it outright rather than through the maestro orchestration?"

set -euo pipefail

source .github/scripts/helpers/log.sh
source .github/scripts/agents/prompt.sh


BLUEPRINT=$(cat blueprint.md)

# The prompt found in README.md
AGENT_PROMPT="Read the following implementation plan carefully and implement it:
$BLUEPRINT"

# The same value found in maestro.sh
JUNIOR_DEVELOPER_MODEL="google/gemma-4-26b-a4b" # Implementation

log INFO "Starting prompt execution..."

# The same conditions as Maestro by using prompt, but only disallow git to give it more freedom of implementation.
prompt "$AGENT_PROMPT" \
        --allowedTools "Read,Edit,Write,Glob,Grep,Bash" \
        --disallowedTools "Bash(git:*)" \
        --model "${JUNIOR_DEVELOPER_MODEL:-sonnet}"

log SUCCESS "Done!"