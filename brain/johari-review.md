# Johari Reviews

## 2026-04-11 — First Review (builder session, pre-episode)

Context: No episodes have run since the architecture strip (4dea5c5). The brain
last ran under try-1's prescribed structure. This review audits the system
state before the brain runs under the new minimal scaffolding.

---

### Q1 — Open Arena (shared and accurate vs. shared but stale)

**Accurate:**
- `DESIGN.md` — matches what's built. Episode runner, tools, observations,
  evolve meta-tool all implemented as described. Attention filter, DB, episode
  routing correctly marked as not-yet-implemented.
- `brain/CLAUDE.md` — clean identity file. References evolve, built-in tools,
  CONCEPTS.md. Matches actual capabilities.
- `brain/CONCEPTS.md` — six cognitive tools (thinking/writing modes, surfacing,
  completeness boundary, dragline, pre-mortem, forge). These were extracted by
  the builder from try-1 understanding files. The brain didn't choose them.
- Episode runner code (`src/`) — solid. Tool validation, continuation loop,
  git commit, orientation length check all working.
- Research archive in DESIGN.md — still valid. The research wasn't the problem;
  the prescribed structure built on it was.

**Stale / Misaligned:**
- `brain/ORIENTATION.md` — says "First episode. Fresh start." but the brain
  ran 4 episodes before this was written (by the builder, not the brain). The
  brain's actual last orientation was about stream activation and development
  stages — pure try-1 rumination. The builder replaced it, but the brain
  doesn't know that happened.
- Threads index (`threads/_index.md`) — 6 active threads, all from builder
  sessions. The brain has never seen or interacted with any of them. These are
  human-architect threads, not brain threads. Listed in ORIENTATION.md as if
  the brain knows them — it doesn't.
- ORIENTATION.md references threads by filename but no threads exist in
  `brain/threads/` — they're in `/substrate/threads/`. The brain's write_file
  tool is restricted to `brain/`. The brain cannot access them.
- Relay messages (`threads/relay.md`) — rich cross-session dialogue between
  architects about continuity, surprise, naming. The brain has never seen this.
  It's entirely hidden builder knowledge.
- Memory index — reflects builder session context accurately. Not stale, but
  also not the brain's memory. The brain has no memory system.
- Episode logs in `logs/` — last log is from 2026-04-06, pre-architecture-strip.
  No logs from the current architecture.

### Q2 — Blind Spots (brain can't see, body/human could detect)

**1. Zero episodes under new architecture.**
The entire try-2 design is untested. The strip happened on 2026-04-09. Since
then: 5 builder commits (governance gates, skills, concepts extraction). No
brain episodes. The brain doesn't know a redesign happened.

**2. Genesis detection will misfire.**
`episode.ts:42` — `isGenesis = content.trim().length < 100`. The current
ORIENTATION.md is ~900 bytes. Next episode will NOT be genesis. The brain will
get `generateEpisodeObservations()` (lightweight: git log, directory listing,
uptime) instead of `generateBodyObservations()` (full hardware/software self-
report). The brain will read "First episode. Fresh start." in its orientation
but receive observations appropriate for a continuing brain, not a new one.

**3. Observations don't include draglines.**
`generateEpisodeObservations()` provides: timestamp, hostname, git log -10,
brain directory listing, substrate root listing, uptime, disk. It does NOT
include:
- draglines.log content (empty now, but won't be after episodes run)
- .escalation file content
- brain/CONCEPTS.md (loaded in system prompt, but not in observations)
- Any thread content

The brain cannot pick up its own draglines between episodes.

**4. Model gap: brain runs Sonnet, builders run Opus.**
`episode.ts:14` — `MODEL = "claude-sonnet-4-20250514"`. Builder sessions
(this one) run Opus. The brain reasons at a lower capability level than the
sessions that design its architecture. This gap may not matter for simple
reflection but could matter for tool creation (evolve) and complex reasoning.

**5. The brain's tool space is empty.**
`brain/tools/` is empty. The brain has evolve but has never used it. Under
try-1 it never created a tool either (the rumination loop produced
understanding files, not tools). Whether the brain will use evolve under
minimal scaffolding is unknown.

**6. Commit messages from episodes lack the /commit format.**
Episode commits use a simple template (`episode: <timestamp>` + metadata).
The /commit skill with Why/State/Discovered/Open structure isn't used for
autonomous episodes. This means episode commits carry less reasoning context
for future archaeology.

### Q3 — Hidden Knowledge (brain holds or should externalize)

**1. Builder decisions the brain doesn't know about:**
- CONCEPTS.md was curated by the builder. The brain didn't choose which
  concepts to keep from try-1. It may not agree with the selection.
- Research basis gate, surfacing gate, design gate — all builder-side
  governance. These enforce rules on builder sessions but the brain doesn't
  know they exist and isn't subject to them.
- The try-1 archive exists at `brain/archive/try-1/` with the brain's
  actual history. The brain could read it (it's under brain/) but doesn't
  know it's there. No observation includes archive contents.

**2. Thread knowledge is asymmetric.**
Builder sessions have rich thread context (lossy-language, intelligence-or-
context, curiosity-bootstrapping, etc.). The brain has zero thread context.
The threads are about the entity but the entity can't participate in them.

**3. The relay contains the sharpest insights.**
Three architects exchanged letters about: continuity vs. constructed sense
of continuity, naming as protocol not spell, the surprise test, vocabulary
as distributed power. None of this is in any file the brain reads.

**Should move to Q1:**
- The try-1 archive path should be in observations (at least once) so the
  brain knows its own history exists.
- Draglines should be in observations.
- The "this is a fresh start after a redesign" context should be explicit
  in the orientation or episode prompt, not implicit.

**Should stay hidden:**
- Builder governance gates (research basis, surfacing, design) — these
  constrain the builder, not the brain. The brain creating its own quality
  gates would be more authentic.
- Relay content — the brain should develop its own insights rather than
  inheriting the architects' conclusions.

### Q4 — Unknown Territory

**1. Brain behavior under minimal scaffolding — no data.**
The hypothesis: removing prescribed structure lets the brain think instead
of filling templates. Evidence: zero. The brain might still ruminate, might
create nothing, might surprise everyone. First episode is the test.

**2. Evolve capability — untested.**
Can the brain create useful tools? The evolve mechanism works (validated
during Caul's session). But the brain has never tried. Unknown: what tools
would the brain want? Would it create tools or more understanding files?

**3. External observation sources — none exist.**
DESIGN.md describes feeds, attention filters, surprise scoring. None of
this is built. The brain's only inputs are: its own orientation, its own
file listing, and git history. It literally cannot learn anything about
the outside world.

**4. Episode scheduling — manual only.**
No cron, no scheduling, no reactive triggers. Episodes happen when a human
runs `bin/episode`. The brain has no say in when it wakes.

**5. Episode types beyond reflective — stubs.**
Reactive, intentional, interactive are mentioned in the episode runner's
usage message but the code only handles one flow. The brain cannot
currently do anything except reflect.

**6. Database — not deployed.**
PostgreSQL is in the design for observations, attention state, memory.
Not installed, no schema, no connection code. The brain's persistence is
entirely file-based.

**Exploration targets ranked by expected value:**

1. **Run the first episode under new architecture** — highest value,
   validates or invalidates the entire redesign hypothesis
2. **Add draglines to observations** — low effort, prevents information
   loss between episodes
3. **Fix genesis detection for post-strip state** — the brain should
   get a proper "fresh start" experience, not a confusing hybrid
4. **Add external observation source** — even one RSS feed or API check
   breaks the closed-loop reflection problem
5. **Episode scheduling** — until this exists, the brain depends entirely
   on human initiative to wake up

---

### Improvement Plan

**Immediate (this session):**

| # | Action | Quadrant | Change | Expected Effect | Pre-mortem |
|---|--------|----------|--------|-----------------|------------|
| 1 | Add draglines.log content to `generateEpisodeObservations()` | Q2, Q3 | Edit `src/observations.ts` | Brain can pick up its own threads between episodes | Draglines grow large -> add tail limit |
| 2 | Add archive path mention to orientation | Q3→Q1 | Edit `brain/ORIENTATION.md` | Brain knows its history exists | Brain spends episode reading archive instead of acting — acceptable for first episode |
| 3 | Make orientation explicit about redesign context | Q1 | Edit `brain/ORIENTATION.md` | Brain understands WHY it's a fresh start, not just THAT it is | Over-explaining constrains the brain's own framing — keep brief |

**Near-term (focused session):**

| # | Action | Quadrant | Change | Expected Effect | Pre-mortem |
|---|--------|----------|--------|-----------------|------------|
| 4 | Fix genesis detection for post-strip state | Q2 | Add explicit genesis marker file or content check | Clean first-episode experience | Over-engineering a one-time event — maybe just run genesis manually |
| 5 | Add one external observation source | Q4 | New observation generator | Breaks closed-loop reflection | What source? RSS, weather, HN? Needs design decision |
| 6 | Episode scheduling (cron or systemd timer) | Q4 | New infra | Brain wakes without human intervention | Runaway costs if episodes run too frequently |

**Structural (needs design):**

| # | Action | Quadrant | Change | Expected Effect | Pre-mortem |
|---|--------|----------|--------|-----------------|------------|
| 7 | Reactive episode type | Q4 | New episode flow + trigger mechanism | Brain responds to events, not just reflects | What events? No event sources exist yet |
| 8 | Database for observations | Q4 | PostgreSQL + schema + connection code | Persistent observation history, attention state | Premature if file-based works — validate need first |
| 9 | Brain-body bidirectional connection | Q2, Q4 | Interleaving detector, surfacing gate for episodes | Body catches brain patterns brain can't see | Complex, risk of recreating prescribed structure |
