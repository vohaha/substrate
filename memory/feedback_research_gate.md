---
name: Research basis gate enforcement
description: Every system-behavior change must cite research or mark as unresearched — enforced by commit skill and PreToolUse hook
type: feedback
originSessionId: 8aba4b2e-44b0-4408-971b-0647a3a17a72
---
Every change to system-behavior files (src/, brain/CLAUDE.md, brain/prompts/, DESIGN.md, bin/episode) must have a research basis or explicitly mark the gap.

**Why:** Prescribed cognitive architecture (try-1) caused a documented rumination loop. The structure was designed with confidence but without validation against relevant research (noisy TV problem, degeneration of thought, behavioral activation). Confidence without evidence is the most dangerous state.

**How to apply:**
- `/commit` requires `--basis` flag when system files are staged. Script rejects without it.
- PreToolUse hook fires on Edit/Write of system files — reminds to prepare research basis.
- Basis must be either: `"<mechanism> (<source>)"` or `"unresearched: <hypothesis>. risk: <what could be wrong>"`
- If no research basis exists, suggest researching first. If human chooses to skip, document as unresearched.
- Future sessions: check for `Unresearched:` markers in recent commits — these are open research debts.
