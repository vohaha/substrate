---
description: "Review the project through Johari Window quadrants. Surface blind spots, hidden knowledge, and unknowns. Produce improvement actions."
user_invocable: true
---

# Johari

Review the substrate project through four knowledge quadrants and produce
concrete improvement actions.

## The Quadrants

In substrate context: **self** = brain, **other** = human + body + environment.

- **Q1 Open** — brain knows, human knows. Shared context that's working.
- **Q2 Blind Spot** — brain doesn't know, human/body could detect. Gaps in
  self-awareness that external machinery should catch.
- **Q3 Hidden** — brain knows, human doesn't. Knowledge that hasn't been
  externalized. Useful friction or accidental opacity.
- **Q4 Unknown** — neither knows. Unexplored territory, untested assumptions,
  missing observation sources.

## Steps

### 1. Audit Q1 — Open Arena

Read the shared context surfaces. Check for staleness, contradictions, gaps.

- `brain/ORIENTATION.md` — is it current? does it reflect actual state?
- Active threads — are they alive or stale?
- `CLAUDE.md` + `DESIGN.md` — do they match what's actually built?
- Memory index — anything outdated?

Report: what's shared and accurate vs. shared but stale.

### 2. Audit Q2 — Blind Spots

These are the high-value finds. The brain structurally cannot see these
without external help.

- **Ask the human:** "What patterns do you see in the brain's behavior that
  it probably doesn't see itself?" — this is the primary Q2 source.
- **Review body detection:** what does the body currently detect and surface?
  What should it detect but doesn't?
- **Check episode patterns:** read recent git history for repetition,
  stagnation, stated-vs-actual gaps.
- **Review intentions vs. actions:** do the brain's stated intentions match
  what actually gets committed?

Report: identified blind spots + proposed detection mechanisms.

### 3. Audit Q3 — Hidden Knowledge

Knowledge the brain holds but hasn't externalized. Some hiding is
appropriate (thinking mode). Some is accidental.

- **Reasoning gaps:** decisions in code without recorded rationale.
- **Undocumented conventions:** patterns the brain follows but hasn't named.
- **Draglines never picked up:** threads logged but never promoted or dropped.
- **Implicit assumptions:** things the brain assumes that aren't written
  anywhere.

Report: what should stay hidden (thinking in progress) vs. what should
move to Q1 (decisions, conventions, resolved threads).

### 4. Audit Q4 — Unknown Territory

Neither party knows what's here. The goal is to identify where to look,
not what to find.

- **Missing observation sources:** what parts of the environment aren't
  being observed at all?
- **Untested assumptions:** beliefs about the system that have never been
  validated.
- **Unexplored capabilities:** body abilities that haven't been tried.
- **Interaction gaps:** conversations or episode types that haven't happened.

Report: exploration targets ranked by expected value.

### 5. Produce Improvement Plan

Synthesize findings into concrete actions. For each action:

- Which quadrant does it address?
- What specifically changes? (file, mechanism, detection, process)
- What's the expected effect?
- Pre-mortem: how could this action fail or make things worse?

Group actions by effort:
- **Immediate** — can do in this session (file updates, stale cleanup)
- **Near-term** — needs a focused session (new detection, new tools)
- **Structural** — needs design work (new body capabilities, episode types)

### 6. Record

Write findings to `brain/johari-review.md` with date. Previous reviews
stay in the file — the drift over time is itself valuable data.

If the human agrees on actions, create tasks or update orientation.

## Argument Handling

$ARGUMENTS

If arguments specify a focus (e.g., "blind spots only", "Q2", "body
detection"), narrow the review to that quadrant. Otherwise, do full review.

## When to Use

- Periodically (every N episodes) as a health check
- When the brain feels stuck or circular
- After major changes to brain architecture or body capabilities
- When the human notices patterns the brain doesn't
