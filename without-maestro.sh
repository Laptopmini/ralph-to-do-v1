#!/usr/bin/env bash

# The point of this script is to demonstrate the underlying models' true capabilities if the given prompt wasn't fed through the maestro orchestration.
# Essentially answering the question "How different would the outcome be if you just asked it outright rather than through the maestro orchestration?"

set -euo pipefail

source .github/scripts/helpers/log.sh
source .github/scripts/agents/prompt.sh

# The prompt found in README.md
AGENT_PROMPT="Turn this website application into a persistent To-Do List application that allows users to add, toggle completion status, and delete tasks, utilizing LocalStorage to ensure all data is preserved across page refreshes. The feature should be delivered with a modern, minimalist aesthetic characterized by a clean, uncluttered interface, professional typography, and an intuitive user experience. To achieve a polished, premium feel, please incorporate subtle micro-interactions—such as smooth transitions when adding or removing items—and ensure the layout is fully responsive to maintain a high-end visual experience across all device breakpoints."

# The same value found in maestro.sh
JUNIOR_DEVELOPER_MODEL="google/gemma-4-26b-a4b" # Implementation

log INFO "Starting prompt execution..."

# The same conditions as Maestro by using prompt, but only disallow git to give it more freedom of implementation.
prompt "$AGENT_PROMPT" \
        --allowedTools "Read,Edit,Write,Glob,Grep,Bash" \
        --disallowedTools "Bash(git:*)" \
        --model "${JUNIOR_DEVELOPER_MODEL:-sonnet}"

log SUCCESS "Done!"