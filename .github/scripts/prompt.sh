#!/usr/bin/env bash
# prompt.sh
# 
# Usage:
#   source ./prompt.sh
#   prompt "<agent prompt>" [options]
# 
# Exit codes:
#   0 = success
#   2 = rate limit / quota / credit exhausted (caller may want to back off long)
#   1 = other engine failure                 (caller may want to retry short)


set -euo pipefail

# Source dependencies
if [[ -f .github/scripts/log.sh ]]; then
    source .github/scripts/log.sh
else
    echo "ERROR: log.sh not found at .github/scripts/log.sh" >&2
    exit 1
fi


prompt() {
    # Parse arguments
    if [[ $# -lt 1 ]]; then
        log ERROR "Usage: prompt \"<agent prompt>\" [extra args...]"
        return 1
    fi

    # Check prerequisites
    if ! command -v claude &> /dev/null; then
        log ERROR "Claude CLI is not installed."
        return 1
    fi

    if ! command -v jq &> /dev/null; then
        log ERROR "jq is not installed."
        return 1
    fi

    local AGENT_PROMPT="$1"
    shift

    local MODEL="haiku"
    local EXTRA_ARGS=()
    local LOCAL_ENV=()

    # Parse arguments to capture --model value
    local ARGS=("$@")                                                                                                                                                                   
    local i=0                                                                                                                                                                           
    while [[ $i -lt ${#ARGS[@]} ]]; do
        local arg="${ARGS[$i]}"                                                                                                                                                         
        if [[ "$arg" == "--model" && $((i+1)) -lt ${#ARGS[@]} && "${ARGS[$((i+1))]}" != --* ]]; then
            MODEL="${ARGS[$((i+1))]}"                                                                                                                                             
            ((i+=2)) || true
        else                                                                                                                                                                      
            EXTRA_ARGS+=("$arg")
            ((i++)) || true                                                                                                                                                       
        fi
    done

    if [[ "$MODEL" != "opus" && "$MODEL" != "sonnet" && "$MODEL" != "haiku" ]]; then
        bash .github/scripts/load-model.sh "$MODEL"

        # Determine the max context window size for the model
        local MAX_CONTEXT_WINDOW=4000
        case "$MODEL" in
            qwen/qwen3.5-35b-a3b)
                MAX_CONTEXT_WINDOW=262144
                ;;
            google/gemma-4-26b-a4b)
                MAX_CONTEXT_WINDOW=120000
                ;;
        esac


        # Setup Claude Code environment variables for LM Studio
        LOCAL_ENV=(
            ANTHROPIC_BASE_URL="http://localhost:1234"
            ANTHROPIC_AUTH_TOKEN="lmstudio"
            # Force all Claude Code model selections (Opus, Sonnet, Haiku) to route through local model.
            # Without these, Claude Code would try to call Anthropic model names that LM Studio does not recognize
            ANTHROPIC_MODEL="$MODEL"
            ANTHROPIC_CUSTOM_MODEL_OPTION="$MODEL"
            ANTHROPIC_CUSTOM_MODEL_OPTION_NAME="LM Studio ($MODEL)"
            ANTHROPIC_CUSTOM_MODEL_OPTION_DESCRIPTION="The local LM Studio server running the model $MODEL locally."
            ANTHROPIC_DEFAULT_OPUS_MODEL="$MODEL"
            ANTHROPIC_DEFAULT_SONNET_MODEL="$MODEL"
            ANTHROPIC_DEFAULT_HAIKU_MODEL="$MODEL"
            CLAUDE_CODE_SUBAGENT_MODEL="$MODEL"
            # Extend shell command timeouts for long-running operations (40-42 minutes)
            BASH_DEFAULT_TIMEOUT_MS="2400000" 
            BASH_MAX_TIMEOUT_MS="2500000"
            # Context Window Settings
            CLAUDE_CODE_AUTO_COMPACT_WINDOW="$MAX_CONTEXT_WINDOW" # Max context window tokens
            CLAUDE_AUTOCOMPACT_PCT_OVERRIDE="90" # Compaction triggers at 90% usage
            # Miscellaneous settings
            API_TIMEOUT_MS="30000000" # Max out timeout for slower models (30 million ms / ~8.3 hours)
            CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY="2" # The model's max concurrent predictions setting in LM Studio
            CLAUDE_CODE_NO_FLICKER="0" # Disable flicker-free rendering mode
            CLAUDE_CODE_ATTRIBUTION_HEADER="0" # Disable special billing header (x-anthropic-billing-header)
            # Disable Claude features not compatible with open-source models
            CLAUDE_CODE_DISABLE_1M_CONTEXT="1"
            CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING="1"
        )
    else
        LOCAL_ENV=(
            ANTHROPIC_MODEL="$MODEL"
        )
    fi

    log WARN "Handing control to $MODEL..." >&2

    local RAW
    local OUTPUT=""
    local ENGINE_EXIT=0
    
    set +e
    RAW=$(mktemp)
    
    env "${LOCAL_ENV[@]}" claude -p "$AGENT_PROMPT" \
        --output-format stream-json --verbose \
        "${EXTRA_ARGS[@]}" 2>&1 \
        | tee "$RAW" \
        | tee >(jq -r --unbuffered 'select(.type=="assistant") | .message.content[]? | select(.type=="text") | .text' >&2) \
        | jq -r 'select(.type=="result") | .result')
    
    ENGINE_EXIT=${PIPESTATUS[0]}
    set -e

    if jq -e 'select(.type=="result") | select(.is_error==true)' "$RAW" >/dev/null 2>&1; then
        local ERR=$(jq -r 'select(.type=="result" and .is_error==true) | .result // .error // "(no detail)"' /tmp/prompt_output_$$ | head -n1)
        log ERROR "Claude returned an error result: $ERR" >&2
        rm -f "$RAW"
        return 1
    fi
    rm -f "$RAW"

    if [[ "$OUTPUT" == *"rate_limit_error"* ]] || \
       [[ "$OUTPUT" == *"insufficient_quota"* ]] || \
       [[ "$OUTPUT" == *"credit balance"* ]]; then
        log ERROR "Claude rate limit exceeded." >&2
        return 2
    fi

    if [[ $ENGINE_EXIT -ne 0 ]]; then
        log ERROR "Engine exited with code $ENGINE_EXIT." >&2
        return 1
    fi

    echo "$OUTPUT"
}
