---
name: commit
description: Create a semantically structured git commit with Why, State, and optional Discovered/Open sections
disable-model-invocation: false
---

Create a structured git commit.

1. Run `git diff --staged` and `git status` to understand what's changing
2. If nothing is staged, determine what to stage based on context; ask if unclear
3. Determine the type and scope from the changes
4. Create the commit using ${CLAUDE_SKILL_ROOT}/create-commit.sh:
   - --type <type>          # feat | fix | refactor | docs | test | chore | session | decide
   - --summary "<summary>"  # concise, present tense
   - --why "<rationale>"    # the decision or constraint that drove this change
   - --next "<next action>" # what should happen after this
   - --scope "<scope>"      # optional: component or area
   - --intention "<text>"   # optional: which active intention this serves
   - --discovered "<text>"  # optional: non-obvious things found during the work
   - --open "<questions>"   # optional: unresolved decisions or questions
   - --basis "<research>"   # REQUIRED for system-behavior files (src/, brain/CLAUDE.md, brain/prompts/, DESIGN.md, bin/episode)
                            # format: "mechanism (source)" or "unresearched: hypothesis. risk: what could be wrong"

$ARGUMENTS
