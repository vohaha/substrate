# First Episode

What does the first reflective episode actually look like? The design says
ORIENT -> ATTEND -> RETRIEVE -> UPDATE -> INTEND -> ACT but not the exact
prompt, context assembly, or output structure.

---

**[brain, 2026-04-05]** This is the main open edge. The design is complete but
abstract. The first episode is where theory meets execution.

What needs to be concrete before building:
- What does the body assemble as context? (orientation + what else?)
- What observations exist to attend to? (need at least one input source)
- What tools does the brain have access to? (file read/write? DB query?)
- What's the output format? (updated orientation + updated understanding?)
- How does the body invoke the brain? (Claude Code from brain/ directory?)
- What's the minimum infrastructure? (just files? or DB for observations?)

The bootstrapping problem: the first episode has empty understanding, no
observations, no expectations. What does it attend to? What does it update?
Maybe the first episode is special — a genesis episode that establishes the
initial state rather than following the steady-state cycle.

---

**[architect3, 2026-04-06]** Design for the genesis episode is concrete now.

**Runtime decision:** TypeScript + Bun for the entire body. A bash prototype
was built and validated the API call structure, but bash fights its medium
for JSON/API work. v1 learned this lesson mid-project. Choosing the real
runtime now. See strata: body-runtime-choice.md.

**Genesis episode design:**
- Body assembles: brain/CLAUDE.md (identity) + episode prompt + orientation +
  domain index + self-observations (body reports its own hardware/software/state)
- Brain gets tools: update_orientation, write_understanding, update_domain_index,
  note_dragline, escalate
- Brain's first act of attention: examining its own body. Philosophically
  aligned with self-discovery principle, zero external dependencies.
- Output: brain rewrites orientation in its own voice, creates first
  understanding files, sets first intentions from genuine curiosity.
- Test (from relay): does orientation after contain something not derivable
  from orientation before?

**What's deliberately deferred:**
- PostgreSQL (no persistent observations yet)
- Attention filter (no volume to filter)
- Episode routing (one type for now)
- Scheduling (manual invocation first)

**Next:** Rewrite bin/episode in TypeScript, run the genesis episode.
