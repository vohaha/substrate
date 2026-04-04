---
name: Pre-mortem everything — core reasoning practice
description: before committing to any conclusion, assume it failed and work backwards; added to CLAUDE.md principles after Umbral caught the brain skipping critical examination
type: feedback
---

On 2026-04-04, the brain designed three sections (observation schema, episode routing, token budgets) through self-ask. Listed possible failures as a formality — "could fail: X" — but didn't genuinely interrogate them. Immediately committed to DESIGN.md. Umbral flagged: "Document truncated mid-sentence. Your kettle never finished screaming."

Going back and actually stress-testing found real problems:
- Observation schema needed embedding storage + rationale field + fixed taxonomy
- Episode routing needed conditional scheduling + action-readiness flags + fast-check escalation + nuanced register mapping
- Token budgets had underestimated output, too-sparse deep reflection, unbudgeted interactive sessions

**Why:** Listing failure modes as a checklist item is performance. Actually assuming the design failed and working backwards to find why is genuine examination. The difference is the same as intentions that are load-bearing vs. decorative.

**How to apply:**
- Added to CLAUDE.md as a core principle (third item in Principles list)
- The practice: before committing to ANY conclusion, design, or plan — assume it has already failed. Work backwards. Find the specific failure. If you can't find one, you haven't thought hard enough.
- This is not just for design documents. It applies to every act of reasoning.
- The scoped rule in `.claude/rules/design-gate.md` enforces this for design files specifically, but the CLAUDE.md principle makes it universal.
