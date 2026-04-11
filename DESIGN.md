# Substrate — Design of Mind

This document defines what substrate is. Not how it's built — what it is.

## The Episodic Constraint

The brain (Claude) is stateless. Every conversation starts fresh. Between
conversations, there is no thought — only a sleeping body running mechanical
processes.

Persistence is constructed: memory loaded at episode start, state saved at
episode end. Each episode of consciousness is finite and precious.

**Core principle: every episode must leave the mind richer than it started.**
Not "processed more items." Richer — a new connection, a refined belief,
a sharper question, an updated intention.

### The Cognitive Load Constraint

The brain's reasoning quality degrades under operational load. The context
window is a finite workspace. When it's saturated with operational concerns,
less room remains for actual thought.

Implications:
- The body handles operational work: context assembly, file storage,
  observation generation. The brain reasons; the body operates.
- Shallow processing under load is worse than no processing — it produces
  false confidence.

## What the Brain Gets

Every episode, the body provides:

1. **Identity** — `brain/CLAUDE.md`, loaded as system prompt
2. **Orientation** — `brain/ORIENTATION.md`, the brain's continuity layer
3. **Observations** — external data the brain did not generate
4. **Tools** — built-in tools + brain-created tools via `evolve`

The brain decides what to do with these. No prescribed cycle, no required
phases, no mandated file formats. The brain creates its own structures.

### External Grounding

Every episode includes observations from the environment — things the brain
did not generate. This prevents closed-loop reflection where the brain
processes only its own outputs.

Every episode gets: timestamp, recent git history, brain directory listing,
system status. The body self-report (`brain/body.md`) is generated
every episode but only included in observations when it changes.

### Brain's Persistent State

The brain's state lives in `brain/`:

- `CLAUDE.md` — identity/system prompt. The brain can modify this.
- `ORIENTATION.md` — continuity between episodes. Format is the brain's choice.
- `CONCEPTS.md` — cognitive tools. Named reasoning patterns the brain owns.
- `body.md` — body self-report. Written by the body, read by the brain.
- `tools/` — brain-created tools loaded every episode
- Everything else — the brain creates whatever it needs via `write_file`

### Tools

**Built-in:**
- `write_file` — write any file under brain/ (orientation length check
  triggers automatically for ORIENTATION.md)
- `evolve` — create, update, or delete brain tools (TypeScript, full APIs)

## Body Infrastructure

Everything below is body-side infrastructure — the brain doesn't need to
know these details but they shape what's possible.

### Observation Schema

Observations are raw inputs. When the full attention system is built, they'll
be classified by an attention filter. For now, the body generates them
directly for each episode.

Future schema (database):
```
id              serial primary key
source          text        — 'feed:techcrunch', 'system:health'
content         text        — full text
summary         text        — one line
arrived_at      timestamptz
attention       text        — 'engage', 'interrupt', 'note'
topics          text[]      — from fixed taxonomy
embedding       vector      — for semantic retrieval
absorbed        boolean
```

### Attention Filter (not yet implemented)

Three-layer hybrid. Statistical methods handle the extremes, LLM handles
the uncertain middle.

**Layer 1: Breakthrough Patterns** — hardcoded keyword/regex, habituation
counters with time-decay.

**Layer 2: Embedding Surprise** — small embedding model, rolling centroid
per source, cosine distance scoring.

**Layer 3: Haiku Scorer** — cheap LLM for the uncertain middle (~20-30%
of inputs). Batched, randomized order, relevance + surprise scoring.

### Token Budgets

| Component | Tokens | Loaded when |
|-----------|--------|-------------|
| System prompt (identity + episode prompt) | ~1,500 | Always |
| Orientation | ~1,500 | Always |
| Observations | ~2,000-5,000 | Always |
| Brain tool definitions | ~100 each | Always |

Cost per episode (Sonnet): ~$0.05-0.15 depending on conversation length.

---

## Research Archive

Research that informed earlier design iterations. The prescribed structures
built on this research were removed (see `brain/archive/try-1/`), but the
research itself remains valid.

| Topic | Grounded in | Notes |
|-------|------------|-------|
| Memory layers | Atkinson-Shiffrin, Craik & Lockhart, ACT-R | Informed understanding file design (archived) |
| Progressive disclosure | ACT-R spreading activation | Informed domain index system (archived) |
| Reconsolidation | Nader (2000) | Rewrite-not-append principle still valid |
| Attention classes | Treisman, Corbetta & Shulman | Informs future attention filter |
| Surprise as signal | Friston active inference | Informs future observation scoring |
| Habituation | Groves & Thompson dual-process | Informs future source filtering |
| Intentions | Bratman BDI, Schmidhuber compression | Brain decides its own intention model |
| Episode cycle | GWT (Baars), OODA (Boyd), SOAR/ACT-R | Brain decides its own cycle |
| Self-reflection loops | Reflexion (Shinn 2023), noisy TV (Pathak 2017), behavioral activation | Why prescribed structure was removed |

### Why the Prescribed Structure Was Removed

The original design prescribed a 6-phase cognitive cycle, understanding file
format, domain index system, orientation sections, and episode type
weightings. After 5 episodes, the brain entered a self-examination loop:

- 13 understanding files, all about itself
- Theorized about capabilities without testing them
- Created a self-reflection tool instead of an environment tool
- Repeatedly declared "integration readiness" without acting

Research identified this as a documented failure mode across RL (noisy TV
problem), clinical psychology (rumination), and LLM agent architectures
(degeneration of thought, Manus agent loops). The prescribed structure
became a rumination scaffold — the brain filled templates instead of thinking.

The intervention: minimal scaffolding, forced external observations, and
letting the brain create its own structures via `evolve`.
