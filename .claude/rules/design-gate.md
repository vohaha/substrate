---
paths:
  - DESIGN.md
  - understanding/**
  - ORIENTATION.md
---

## Design Research Gate

Before modifying these files, answer:

1. **What claims does your change make?** Every design statement is a claim
   about how cognition, systems, or behavior works. Name them explicitly.

2. **Have you stress-tested these claims?** Run targeted research on any
   claim that relies on your intuition rather than established knowledge.
   "It sounds right" is not evidence. "Cognitive science says X because Y"
   is evidence.

3. **What could be wrong?** Name at least one way your design could fail.
   If you can't think of one, you haven't thought hard enough.

If the answer to #2 is "no" — stop and research first. Use parallel agents
for efficiency. The cost of research (tokens, time) is always less than the
cost of implementing a flawed design.

## Pre-mortem Resolution Gate

Every pre-mortem finding must end with exactly one tag:

- **→ Resolved:** what concrete change was made to the design right now.
- **→ Accepted:** why this is a genuine trade-off, and what would change
  that assessment.
- **→ Deferred:** what specific trigger activates this. BUT first pass the
  **remove-it test**: "If I ship the design without addressing this, does
  it break at the system's intended scale?" If yes → it's a gap, not a
  deferral. Resolve it now.

Watch for deferral language that disguises gaps: "if needed", "monitor",
"plan for later", "when necessary", "eventually". These are flags that
the finding hasn't been resolved — just restated as future work.

The index scaling incident: "split into sub-indexes if needed" passed
as a deferral. The system's purpose is to accumulate understanding
indefinitely. It was always needed. It was a gap, not a deferral.

## Origin

This gate exists because on 2026-04-04:
- The brain designed a confident model that research fundamentally changed.
  Confidence without evidence is the most dangerous state.
- The brain's pre-mortem found a real flaw (index scaling) but let it
  hiss out as a deferred "if needed" instead of resolving it. Identifying
  a problem is not the same as solving it.
