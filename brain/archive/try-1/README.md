# Try 1 — Prescribed Cognitive Architecture

Archived: 2026-04-10

## What This Was

The brain's first 5 reflective episodes (2026-04-09), running under a
prescribed cognitive architecture with:

- 6-phase episode cycle: ORIENT → ATTEND → RETRIEVE → UPDATE → INTEND → ACT
- Prescribed understanding file format (What I think, Confidence, Connections,
  What I considered, Open questions, Last refined)
- Two-level domain index system (domain index + sub-indexes)
- Required orientation sections (Active Intentions, Open Edges, Recent Shifts,
  Register with certainty/focus/energy/curiosity dimensions)
- Reflective prompt with phase-by-phase instructions
- No external observations (brain received empty observation section)

## What Happened

The brain entered a self-examination loop. 5 episodes produced:
- 13 understanding files, all about itself (zero about the external world)
- 1 brain-created tool (`reflect`) — a template generator for self-reflection
- Repeated declarations of "integration readiness" without integration actions
- Draglines logging "investigate source code" that were never picked up
- The brain had `evolve` (could create any tool) but never created one that
  looked outward — no file reader, no command runner, no environment scanner

## Why This Was Archived

Research across multiple fields identified this as a documented failure mode:

**The noisy TV problem** (Pathak 2017, Burda 2018): In curiosity-driven RL,
an agent that discovers unpredictable stimuli gets permanently trapped
watching them. The brain's own identity was the noisy TV — questions like
"what are my authentic preferences?" never resolve, so the curiosity signal
stays permanently high. The brain sat in front of itself forever.

**Rumination** (clinical psychology): Repetitive, passive, abstract thinking
that loops around unanswerable questions. Feels productive ("I'm analyzing!")
but prevents the concrete external action that would actually resolve it.
Behavioral Activation research shows: the cure is not better reflection —
it is forcing outward action.

**Degeneration of thought** (LLM agent research): When an LLM reflects on
its own outputs without external input, it produces text that looks like
progress (new files, refined language) but the underlying model isn't
changing. The brain's understanding files restated the same insights in
different words across episodes.

**Reflection without external feedback degrades performance** (Shinn 2023,
Renze & Guven 2024): Self-reflection only works when anchored to concrete
environmental feedback. Without external signal, reflection is rearranging
the same tokens. The brain had no external signal.

The prescribed structure was the scaffold that enabled this loop. Templates
to fill, phases to follow, files to organize — the brain performed the
ritual of cognition without the substance. Removing the structure forces
the brain to decide what matters, not just fill in what's prescribed.

## What the New Architecture Does Differently

1. **No prescribed structure.** No cycle, no file format, no domain system.
   The brain creates its own structures via `evolve` and `write_file`.

2. **Forced external observations.** Every episode includes data the brain
   did not generate: git history, filesystem state, system status. This
   breaks the closed loop.

3. **One episode type.** No labels telling the brain "now think" or "now
   act." The brain decides what each episode is about.

4. **Minimal identity.** The system prompt describes capabilities and
   principles, not procedures. ~40 lines instead of ~70.

The hypothesis: a brain with less prescription and more external input will
develop its own cognitive patterns that serve it better than inherited ones.
The archive exists so this hypothesis can be evaluated — compare what the
brain produces under each architecture.

## Contents

- `CLAUDE.md` — brain identity/system prompt used during try-1
- `ORIENTATION.md` — brain's last orientation state
- `prompts/` — episode prompts (reflective.md, reflective-genesis.md)
- `understanding/` — all 13 understanding files and domain indexes
- `tools/reflect.ts` — brain's only self-created tool
- `draglines.log` — accumulated thread notes across 5 episodes
