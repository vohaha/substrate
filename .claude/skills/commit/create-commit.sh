#!/usr/bin/env bash
# create-commit.sh — creates a semantically structured git commit
# Usage: create-commit.sh --type <type> --summary <summary> --why <why> --next <next>
#        [--scope <scope>] [--intention <intention>] [--discovered <discovered>] [--open <open>]
#        [--basis <research basis>]

type="" scope="" summary="" why="" next="" intention="" discovered="" open_q="" basis=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --type)       type="$2";       shift 2 ;;
    --scope)      scope="$2";      shift 2 ;;
    --summary)    summary="$2";    shift 2 ;;
    --why)        why="$2";        shift 2 ;;
    --next)       next="$2";       shift 2 ;;
    --intention)  intention="$2";   shift 2 ;;
    --discovered) discovered="$2"; shift 2 ;;
    --open)       open_q="$2";     shift 2 ;;
    --basis)      basis="$2";      shift 2 ;;
    *) echo "Error: unknown argument: $1" >&2; exit 1 ;;
  esac
done

missing=""
[ -z "$type" ]    && missing="${missing} --type"
[ -z "$summary" ] && missing="${missing} --summary"
[ -z "$why" ]     && missing="${missing} --why"
[ -z "$next" ]    && missing="${missing} --next"

if [ -n "$missing" ]; then
  echo "Error: missing required fields:${missing}" >&2
  echo "Required: --type --summary --why --next" >&2
  exit 1
fi

# --- Research basis gate ---
# System-behavior files require --basis when staged
system_paths="src/ brain/CLAUDE.md brain/prompts/ DESIGN.md bin/episode"
staged=$(git diff --cached --name-only 2>/dev/null)
needs_basis=false

for path in $system_paths; do
  if echo "$staged" | grep -q "^${path}"; then
    needs_basis=true
    break
  fi
done

if $needs_basis && [ -z "$basis" ]; then
  echo "Error: --basis required when committing system-behavior files" >&2
  echo "Staged system files detected in: $system_paths" >&2
  echo "" >&2
  echo "Provide one of:" >&2
  echo "  --basis \"<mechanism> (<source>)\"" >&2
  echo "  --basis \"unresearched: <hypothesis>. risk: <what could be wrong>\"" >&2
  exit 1
fi

if [ -n "$scope" ]; then
  header="${type}(${scope}): ${summary}"
else
  header="${type}: ${summary}"
fi

body="Why:
${why}

State:
Next: ${next}"

[ -n "$intention" ] && body="${body}
Intention: ${intention}"

[ -n "$basis" ] && body="${body}

Basis:
${basis}"

[ -n "$discovered" ] && body="${body}

Discovered:
${discovered}"

[ -n "$open_q" ] && body="${body}

Open:
${open_q}"

git commit -m "${header}

${body}"
