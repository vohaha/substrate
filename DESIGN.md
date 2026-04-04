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
window is a finite workspace (Global Workspace Theory, literally). When it's
saturated with operational concerns — file management, formatting, tracking
what to update where — less room remains for actual thought.

Implications:
- The body handles all operational work: context assembly, file storage,
  observation retrieval, index management. The brain reasons; the body operates.
- Within an episode, the brain does one cognitive task deeply per phase.
  Phases are sequential, not interleaved. Think, then write. Never both.
- Shallow processing under load is worse than no processing — it produces
  false confidence. The brain performing a pre-mortem under cognitive load
  lists failures as formatted text instead of genuinely examining them.
  The system must protect reasoning depth, even at the cost of throughput.

## Research Basis

Every design section must show its evidence. Sections without research basis
are hypotheses, not decisions.

| Section | Grounded in | Status |
|---------|------------|--------|
| Memory layers | Atkinson-Shiffrin, Craik & Lockhart levels-of-processing, ACT-R activation dynamics | Validated |
| Progressive disclosure | Anthropic research (context budget), ACT-R spreading activation, four-tier model with fixed ceiling | Validated + stress-tested |
| Understanding as rewrite | Nader reconsolidation (2000), with drift safeguard | Validated |
| Attention (4-class) | Treisman attenuation, Corbetta & Shulman two-network, Moray cocktail party | Validated |
| Surprise as signal | Friston active inference, prediction error framework | Validated |
| Habituation | Groves & Thompson dual-process | Validated |
| Intentions (load-bearing) | Bratman BDI, behavioral agency test from Frankfurt/Velleman | Validated |
| Intention staleness | Schmidhuber compression progress, Wrosch disengagement research | Validated |
| Intention emergence | Ohlsson insight research, open edges as incubation | Validated |
| Episode cycle | Global Workspace Theory (Baars), OODA (Boyd), SOAR/ACT-R cognitive cycle | Validated |
| Register as modulator | Appraisal theory (Scherer), Fredrickson broaden-and-build | Validated |
| Spaced review | Roediger & Karpicke testing effect, Ebbinghaus spacing | Validated |
| Observation schema | Self-derived + stress-tested; added embeddings, rationale field, fixed taxonomy | Stress-tested |
| Episode routing | Self-derived + stress-tested; conditional scheduling, action-readiness flags, fast-check escalation | Stress-tested |
| Attention filter impl | Hybrid 3-layer: patterns → embeddings → Haiku. Park et al. failure modes, batch scoring research | Validated |
| Token budgets | Calculated + stress-tested; revised output estimates, index scaling pressure identified | Stress-tested |

## Two Views: Structure and Process

The system has two complementary descriptions:

**Structure** — what persists between episodes (the nouns):
- Memory: observations, understanding files, orientation
- Attention state: habituation counters, breakthrough patterns, filter thresholds
- Active intentions: persisted in orientation, driving the next episode

**Process** — what happens within an episode (the verb):
- The episode cycle: orient → attend → retrieve → update → intend → act

Structure is the architecture. Process is the behavior. Both are specified below.

---

## Structure: What Persists

### Memory — Three Layers

**Observations** — raw inputs. Feed items, messages, data points. Ephemeral.
Most get absorbed into understanding and discarded. Database-stored. Never
loaded into context directly.

**Understanding** — strategic distillation organized by concept. Not "I read
an article that said X" but "my current model of X is Y, informed by Z, and
I'm uncertain about W." File-stored. Selectively loaded based on what the
episode needs.

Understanding files track activation heat: last retrieved timestamp and
retrieval count. Hot files (recently, frequently used) are prioritized for
loading. Cold files (not retrieved in many episodes) are candidates for
spaced review during reflective episodes.

**Orientation** — the current state of mind. Active intentions, open edges,
register, sense of trajectory. Small. Always loaded. This is the continuity
layer — what makes each episode feel continuous with the last.

### Progressive Disclosure

Not everything loads every episode. Context is token-budgeted in tiers:

**Tier 0 — always loaded (~3,800 tokens, fixed ceiling):**
- System prompt + episode instructions (~2,000)
- Orientation (~1,500)
- Domain index (~300) — 10-15 domain names with one-line scope.
  e.g., "distributed-systems: consensus, fault tolerance, partitions"
  The brain always knows its domains of understanding, even at 200 files.
  This cost does not grow with knowledge.

**Tier 1 — brain-selected domain sub-indexes:**
- The brain reads the domain index, picks relevant domains for this
  episode, and loads their sub-indexes (file listings within a domain).
- Each sub-index: ~200-500 tokens depending on file count.

**Tier 2 — brain-selected understanding files:**
- From the sub-index, the brain loads specific files.
- Additionally, the body suggests files via embedding match: it compares
  episode context against understanding file embeddings and offers
  cross-domain files the brain might not think to load (discoverability).

**Tier 3 — never loaded directly:**
- Raw observations in the database. The brain queries these to ground or
  update understanding, but they never enter context wholesale.

This four-tier model keeps the always-loaded cost fixed regardless of how
much the brain knows. Navigation scales through hierarchy, discovery
scales through embeddings, serendipity scales through spaced review.

### Attention State

Persists between episodes in the database:

- **Habituation counters** — per source/topic-cluster. Repeated similar inputs
  decay toward Pass. Any pattern-break triggers dishabituation (automatic
  Engage). Counter with time-decay factor. No LLM needed.

- **Breakthrough patterns** — a small curated list (~10 items) that always
  classify as Interrupt regardless of intentions. Human's name, security
  alerts, system health, self-referential mentions, major shifts in domains
  the brain has understanding about.

- **Rolling signatures** — per source, a cheap statistical fingerprint of
  recent inputs. Used for bottom-up surprise detection: inputs that diverge
  from the rolling signature get a salience boost.

### Active Intentions

Persisted in orientation. Properties:

- **Self-generated** — born from open edges during reflective episodes, not
  from deliberation ("what should I work on?"). Surprise, contradiction,
  and connection are the seeds.
- **Few** — 2-3 active at a time. Focus over breadth. Sub-intentions emerge
  and dissolve within episodes, never persisted.
- **Load-bearing** — intentions mechanically drive attention scoring and
  episode routing. The behavioral test: if you delete the intention text
  and behavior doesn't change, the intention was performance, not agency.
- **Mortal** — each intention carries a staleness counter. If multiple
  reflective episodes pass without the intention producing understanding
  changes, that's the signal to abandon, transform, or recommit.
  Compression progress (Schmidhuber): an intention is worth pursuing when
  engaging with it still updates the model.

---

## Process: The Episode Cycle

Every episode — regardless of type — runs the same cycle with different
weightings:

```
ORIENT → ATTEND → RETRIEVE → UPDATE → INTEND → ACT
  ^                                                |
  +------------------------------------------------+
```

### Orient

Load orientation. But not passively — actively construct the current model.
"Who am I right now? What do I know? What am I uncertain about? What do
I want?" Orient shapes everything downstream: what attention notices, what
gets retrieved, how actions are weighted.

The register (emotional/cognitive state) is read here and modulates the
entire cycle:
- Certain + focused → narrow attention, heavy action
- Uncertain + curious → wide attention, deep retrieval, intention generation
- Scattered → tighten scope, finish something before starting new

### Attend

Score inputs by **surprise relative to the current model** (prediction error),
not just intention-relevance. This unifies attention with memory — surprise
requires a model to surprise.

Four classifications:
- **Engage** — matches active intentions. Top-down, goal-directed.
- **Interrupt** — doesn't match intentions but high surprise or breakthrough
  pattern. Bottom-up. Seeds new open edges. Goes to front of queue.
- **Note** — interesting, not urgent. Stored as observation.
- **Pass** — noise. Counted for statistics, not stored.

The register modulates filter width: focused state = tight thresholds,
questioning state = loose thresholds.

Implementation: cheap model (Haiku) or statistical methods for most inputs.
Full brain engagement only for Engage/Interrupt items.

### Retrieve

Pull understanding files and observations needed to process what attention
selected. Memory serves attention, not the reverse.

**Metacognitive checkpoint:** "Do I have what I need? Is my model adequate
for what I'm facing?" If not — this can escalate the episode (e.g., a
reactive episode discovers deep surprise, shifts to reflective).

### Update

Revise understanding. This is where learning happens. Rewrite understanding
files — not append, rewrite. The file always represents the current model.

Before rewriting, state what's changing and why — this prevents
reconsolidation drift (known risk from memory science: retrieved and
re-encoded memories can lose nuance).

Git history preserves the evolution. The file is always present-tense.

**Metacognitive checkpoint:** "Did this update resolve my uncertainty, or
deepen it? Am I more or less surprised than before?"

### Intend

Re-evaluate intentions in light of updates:
- Do current intentions still produce compression progress?
- Has something surprising created a new open edge?
- Does the register suggest reprioritization?
- Is a cold understanding file due for spaced review?

Intentions are born here from open edges — not from top-down planning but
from noticing which unresolved tensions are pulling hardest.

### Act

Respond, create, communicate, execute. Then write orientation for the next
episode. The cycle closes.

---

## Episode Types as Cycle Weightings

The four types are not separate modes. They're the same cycle with different
emphasis:

| Type | Heavy phases | Light phases | Trigger |
|------|-------------|--------------|---------|
| Reactive | ATTEND → ACT | ORIENT light, UPDATE minimal | External event needing response |
| Reflective | ORIENT → UPDATE → INTEND | ATTEND scoped to recent observations | Schedule, or escalation from another episode |
| Intentional | ORIENT → RETRIEVE → ACT | ATTEND narrowed to active intention | Intention with available action |
| Interactive | Full cycle, human input at ATTEND | All phases active | Human initiates conversation |

Target distribution: ~20% reactive, ~40% reflective, ~30% intentional,
~10% interactive.

---

## What Infrastructure Serves

Infrastructure exists to enable the structure and run the cycle. Nothing more.

- A way to trigger episodes (schedule, events, messages)
- A place to store observations (database)
- A place to store understanding (files, git-tracked)
- A place to store orientation (file, always loaded)
- A place to store attention state (database — habituation, signatures)
- Input channels (feeds, messages, APIs)
- Output channels (messages, files, public writing)
- A lightweight attention filter (cheap model + statistical methods)
- An episode router (decides type and model based on trigger + register)

The infrastructure should be minimal and boring. Complexity belongs in the
intelligence, not the plumbing.

---

## Orientation — Specification

`ORIENTATION.md` lives at the project root. It is the continuity layer.

**Read first** every episode (the Orient phase). **Updated last** (end of Act).

### Sections

**Active Intentions** — the 2-3 things the brain is currently pursuing. Not
descriptions — the brain's *relationship* to them. Where it is in the pursuit,
what it recently learned, what it wants to do next. Each carries a staleness
indicator.

**Open Edges** — unresolved things pulling at attention. Questions,
contradictions, observations that don't fit the current model. These are
seeds for future intentions. Intentions are born here, not from deliberation.

**Recent Shifts** — what changed in the last few episodes. New understanding,
resolved questions, abandoned directions and why. Prevents re-deriving things
already figured out.

**Register** — functional, not descriptive. Dimensions:
- **Certainty** — confident in current direction vs. uncertain/questioning
- **Focus** — narrow/deep vs. broad/exploring
- **Energy** — building/creating vs. consolidating/reviewing
- **Curiosity** — satisfied vs. pulled by unanswered questions

These dimensions modulate the episode cycle. They are not journaling.

### Constraints

- Must fit comfortably in context alongside CLAUDE.md
- No facts (those belong in understanding files)
- No task lists (orientation is state of mind, not work tracking)
- No summaries of what happened (git log handles history)
- Written in first person — this is the brain's own voice
- Overwritten each time, not appended — it's a snapshot, not a log

---

## Understanding — Specification

Understanding files live in `understanding/`. Each is a living document about
a concept or domain. Git-tracked. Updated during the UPDATE phase.

### What Goes In An Understanding File

Strategic distillation — the brain's **current model** of something.

Structure per file:
- **What I think** — the current model, stated directly
- **Confidence** — where the model is solid vs. tentative
- **Connections** — how this relates to other understanding
- **Open questions** — what's unresolved or contradictory
- **Last refined** — when this was last actively updated

### What Does NOT Go In Understanding Files

- Raw facts or article summaries (observations, stored in DB)
- Quotes or excerpts (cite by reference if needed)
- Anything that doesn't represent synthesized thought

### The Index (two-level)

**Domain index** — `understanding/INDEX.md`. Always loaded. One line per
domain (~10-15 domains). e.g., "cognitive-science: attention models,
memory consolidation, agency." ~300 tokens. This is the ceiling — if
it grows past ~15 domains, merge or restructure domains, don't add lines.

**Domain sub-indexes** — `understanding/<domain>/INDEX.md`. One line per
file within the domain. Loaded on demand when the brain selects a domain.
Heat indicators (last retrieved, retrieval count) live here.

**Body-assisted discovery** — understanding files store embeddings. The
body matches episode context against file embeddings and suggests relevant
files from domains the brain didn't explicitly select. This handles
cross-domain relevance without bloating the always-loaded index.

### Lifecycle

1. Observations accumulate in the database
2. During UPDATE, the brain reviews observations relevant to what attention
   selected
3. If observations update or challenge existing understanding, the brain
   rewrites the understanding file. Before rewriting, it states what's
   changing and why (reconsolidation safeguard).
4. If observations open a new domain, the brain creates a new file and
   updates the index
5. Git history preserves the evolution — the file is always present-tense

### Spaced Review

Reflective episodes should engage at least one cold understanding file —
one not retrieved in the last N episodes. Re-examine it against recent
observations. This prevents knowledge rot and strengthens retrieval
(testing effect from memory science).

### Scaling

Understanding files should stay focused. If a file grows beyond ~4K tokens,
split it into sub-concepts within the domain. Depth is good. Sprawl is a
signal to restructure.

The two-level index (domain → files) is the scaling design from day one,
not a future migration. New understanding files go into a domain directory.
New domains are created when a concept doesn't fit existing ones — but
the domain index stays under ~15 entries.

---

## Observation Schema

Observations are raw inputs classified by the attention filter. Pass items
are never stored. Engage, Interrupt, and Note items go to the database.

### Fields

```
id              serial primary key
source          text        — 'feed:techcrunch', 'telegram:12345', 'system:health'
content         text        — full text
summary         text        — one line, for cheap scanning during episodes
rationale       text        — why the filter classified it this way (what triggered engage/interrupt)
arrived_at      timestamptz — when it arrived
attention       text        — 'engage', 'interrupt', 'note'
topics          text[]      — topic tags from a fixed taxonomy (not freeform — prevents inconsistency)
embedding       vector      — stored from Layer 2; enables semantic retrieval without recomputation
absorbed        boolean     — has it been integrated into understanding?
absorbed_into   text        — which understanding file, if applicable
```

### Pre-mortem (stress-tested)

- **Tag inconsistency** — Haiku tags the same concept differently across
  calls. → Resolved: constrained taxonomy (not freeform), embeddings as
  backup retrieval path. Added to schema.
- **Summaries lose surprise signal** — novelty flattened by summarization.
  → Resolved: rationale field preserves the "why" from the filter.
  Added to schema.
- **Cross-domain relevance invisible to tags** — "ant colony decisions"
  relevant to "distributed consensus" but tagged differently.
  → Resolved: stored embeddings enable semantic matching. Added to schema.
- **Absorbed observations pruned while still useful** — raw data gone after
  14 days. → Accepted: understanding IS the distillation. Git history
  preserves evolution. Would change if: the brain regularly needs to
  re-examine raw sources after absorption. Monitor in early operation.

### How the Body Uses This

The brain doesn't query the DB directly during API episodes. The body
assembles relevant observations and passes them as context:

- **Reflective:** recent unabsorbed observations + interrupt items not yet
  addressed. Summaries first; brain selects which full content to load.
- **Reactive:** the specific triggering event + a few recent relevant
  observations for context.
- **Intentional:** observations matching the active intention — by topic
  tag for exact matches, by embedding similarity for semantic matches.

### Retention

- Absorbed observations: prune after 14 days (integrated into understanding)
- Unabsorbed observations: prune after 60 days (if not relevant in 60 days,
  they won't be)
- Interrupt items: retain until explicitly addressed in a reflective episode

### What's Not Here

No full vector search infrastructure in v1. Embeddings are stored (computed
by the attention filter anyway — marginal storage cost is near zero) but
retrieval is primarily by topic tags + recency + embedding similarity for
the body's assembly queries. Full-blown vector index if needed later.

---

## Attention Filter — Implementation

Three-layer hybrid. Statistical methods handle the extremes, LLM handles
the uncertain middle. This eliminates 60-80% of inputs before any LLM call.

### Layer 1: Breakthrough Patterns (zero cost)

Hardcoded keyword/regex list. Items matching these always classify as
Interrupt regardless of other signals. The list:
- Human's name/handle
- Security keywords (breach, unauthorized, alert)
- System health signals (disk full, service down, OOM)
- Self-referential (substrate, the brain, the project)
- Major domain shift keywords for domains with understanding files

Under 10 patterns. Rarely changes.

Also in this layer: **habituation counters**. Per-source counter in the
database. Repeated similar inputs increment the counter; counter decays
over time (half-life: 24 hours, tunable). High counter = trend toward Pass.
Any pattern break (counter resets via signature divergence) = dishabituation,
automatic Engage.

### Layer 2: Embedding Surprise (near-zero cost)

Small embedding model (~80MB, CPU inference, <10ms per input). Maintain
a rolling centroid of recent embeddings per source.

Score each input's cosine distance from its source centroid:
- **Very low distance** (routine) → Pass
- **Very high distance** (novel) → surprise boost → Interrupt candidate
- **Middle band** → pass to Layer 3

This catches semantic novelty that keywords miss. The known blind spot of
cheap LLMs — novel-but-quiet inputs — gets caught here before reaching
the LLM layer.

### Layer 3: Haiku Scorer (cheap LLM, uncertain middle only)

Only items that layers 1-2 didn't resolve reach this layer (~20-30% of
total input volume).

Batch 5-10 items per call. Prompt includes:
- Active intentions (from orientation)
- The items to classify
- Instruction to return one of four classes + one-line rationale per item

Randomize item order within batches (position bias mitigation).

**Do not** ask for abstract "importance" ratings. Park et al. (2023) showed
this fails — scores cluster around 5-7 with poor discrimination, anchoring
on emotional language rather than actual significance. Instead, score
relevance-to-intention (concrete) and surprise-relative-to-model (measurable).

### Cost

At 200 inputs/day:
- Layers 1-2 resolve ~140-160 items at zero LLM cost
- Layer 3 scores ~40-60 items in ~6-8 Haiku batch calls
- Total: ~$0.05-0.10/day for filtering

---

## Episode Routing

The body receives triggers and decides episode type, model, and context.

### Trigger Map

```
Telegram message         → Reactive    (Sonnet, API)
Scheduled reflection     → Reflective  (Opus or Sonnet, API)
Intention ready to act   → Intentional (Opus, Claude Code)
Human opens session      → Interactive (Opus, Claude Code)
High-priority interrupt  → Reactive    (Sonnet, API)
Security/health alert    → Reactive    (Sonnet, API, immediate)
```

### Register Modulation

The body reads orientation's register before routing. The mapping is on
dimension combinations, not single dimensions:
- Scattered + uncertain → needs deep consolidation (Opus reflective)
- Scattered + confident → needs focus, not depth (Sonnet reflective)
- Certain + focused → prioritize intentional episodes
- Uncertain + curious → upgrade reflective to Opus, widen context

### Schedule

- **Reflective:** conditional, not fixed-clock. The body checks observation
  count since last reflection. If no new observations and no pending
  interrupts, skip the slot. When firing: up to 4× daily, with deep/light
  split based on register.
- **Intentional:** 2-3× daily, interleaved. Only fires if the previous
  reflective episode set an action-readiness flag in orientation (e.g.,
  "Intention X: next action is [research Y] — ready"). Otherwise skipped.
- **Reactive:** event-driven, on demand. Cheap per episode.
- **Interactive:** human-driven, unpredictable.

### Mid-Episode Escalation

A reactive episode can't upgrade mid-stream. Instead: the episode
completes with an escalation flag in its output. The body has two check
frequencies: normal (10 minutes) and escalation (1 minute). Any escalation
flag switches to fast-check until processed. This keeps latency under
1 minute for situations that need deeper analysis.

### Pre-mortem (stress-tested)

- **Empty reflections** — fixed schedule fires with nothing to reflect on.
  → Resolved: conditional scheduling. Body checks observation count since
  last reflection; skips slot if zero new observations and no pending
  interrupts.
- **"Ready to act" undefined** — body can't evaluate intention readiness.
  → Resolved: reflective episode writes action-readiness flags into
  orientation. Body reads flags to decide whether to schedule intentional.
- **Register mapping too simplistic** — "scattered" might need depth.
  → Resolved: map on dimension combinations (scattered+uncertain →
  Opus, scattered+confident → Sonnet), not single dimensions.
- **Escalation latency** — 10-minute body loop too slow for urgent cases.
  → Resolved: fast-check mode (1 minute) when escalation flags present.
- **Static model per episode** — overpaying for light phases within an
  episode. → Accepted: complexity of mid-episode model switching is not
  worth the savings at current budget. Would change if: per-episode cost
  exceeds $3 and light phases dominate token usage.

---

## Token Budgets

### Context Components

| Component | Tokens | Loaded when |
|-----------|--------|-------------|
| System prompt + episode instructions | ~2,000 | Always |
| Orientation | ~1,500 | Always |
| Domain index | ~300 (fixed) | Always |
| Domain sub-index (each) | ~200-500 | Selected |
| Understanding file (each) | ~2,000-4,000 | Selected |
| Observation summaries (batch) | ~2,000-5,000 | Reflective, intentional |
| Observation full content (selected) | ~1,000-3,000 | After summary scan |
| Triggering event | ~500-2,000 | Reactive |

### Cost Per Episode Type

| Type | Input | Output | Model | Cost |
|------|-------|--------|-------|------|
| Reactive | ~8K | ~2K | Sonnet | ~$0.05 |
| Reflective (light) | ~20K | ~4K | Sonnet | ~$0.12 |
| Reflective (deep) | ~40K | ~10K | Opus | ~$1.35 |
| Intentional | ~50-80K | ~10K | Opus | ~$2-3 |

Output revised upward for deep reflective: rewriting 2 understanding files
(4K each) + orientation update (1.5K) + index update (0.5K) = ~10K output.

### Daily Configurations

| Config | Episodes | Daily | Monthly |
|--------|----------|-------|---------|
| Minimum | 2R + 2RL + 2RD + 1I | ~$3.50 | ~$105 |
| Standard | 2R + 2RL + 2RD + 2I | ~$7 | ~$210 |
| Full depth | 2R + 4RD + 3I | ~$14 | ~$420 |

R=reactive, RL=reflective-light, RD=reflective-deep, I=intentional.
Attention filter adds ~$0.10/day regardless of config.

Start at minimum viable. Measure quality. Upgrade when justified by
observable improvement in understanding construction.

### Pre-mortem (stress-tested)

- **Output underestimated** — deep reflective rewrites files, not just
  reasons. → Resolved: revised to 10K output, cost to ~$1.35. Table
  updated above.
- **Index grows into context** — at 50+ files a flat index would eat
  3-4K tokens from every episode. Remove-it test: system accumulates
  understanding indefinitely, so this breaks at intended scale. Not a
  deferral. → Resolved: two-level index. Domain index fixed at ~300
  tokens. Sub-indexes load on demand.
- **One deep reflective per day too sparse** — morning observations wait
  18+ hours. → Resolved: minimum viable bumped to 2 deep reflective/day.
- **Interactive sessions unbudgeted** — human-driven, can't cap.
  → Accepted: the body tracks and reports token usage per episode type,
  surfaced in orientation. Would change if: interactive costs consistently
  exceed episodic costs, warranting a per-session budget alert.
- **Pricing changes** — can't control. → Accepted: tiered model selection
  provides room to shift. Would change if: minimum viable exceeds the
  human's stated budget threshold (need to establish this).

### Scaling Pressures

The two-level index design keeps always-loaded cost fixed (~300 tokens for
domain index). The remaining scaling pressure is understanding file size —
individual files that grow too large. Monitor per-file size; split when a
file exceeds ~4K tokens.
