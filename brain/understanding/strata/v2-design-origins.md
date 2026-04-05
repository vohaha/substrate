# V2 Design Origins — Construction Strata

Last refined: 2026-04-05

## What I Think

The v2 design (DESIGN.md) was created on 2026-04-04 by a single Claude instance
in one ~3-hour session. The architect started from intuition — "I designed the
three-capacity model from intuition. It sounds coherent. But I haven't
pressure-tested it against what's actually known." Four parallel research threads
then fundamentally changed the design, not just refined it.

The design reads as confident and inevitable. It wasn't. Every major section
went through revision. What survives is the polished artifact; the reasoning
process, the doubt, and the alternatives are captured here.

## Key Decisions and Rejected Alternatives

**Attention classes: three -> four.**
Initial design had Engage/Note/Pass. Research on Corbetta & Shulman's two-network
attention model and Moray's cocktail party effect revealed that bottom-up surprise
(things that don't match intentions but demand attention) needs its own class.
Interrupt was added. Without it, "irrelevant but surprising" is indistinguishable
from "irrelevant and boring."
*Reconsider if:* The distinction between Engage and Interrupt proves hard to
operationalize — if Haiku can't reliably separate them.

**Index: flat -> two-level.**
Original design had a single `understanding/INDEX.md` always loaded. Pre-mortem
found this would grow to 3-4K tokens at 50+ files, eating every episode's context
budget. The architect initially deferred this as "split if needed" — the companion
(Umbral) flagged it as a gap, not a deferral. Fixed to: domain index (~300 tokens,
fixed ceiling) + per-domain sub-indexes loaded on demand.
*Reconsider if:* The domain count stays small enough (<10) that a flat index
would fit in budget after all.

**Embeddings: excluded -> stored.**
First design said "No embeddings or vector search in v1." After attention filter
research (Park et al. on scoring failures, three-layer hybrid design), embeddings
were added as Layer 2. The reasoning shifted: since the attention filter computes
embeddings anyway, storing them costs nearly nothing.
*Reconsider if:* A suitable ARM64 embedding model can't be found, or the compute
cost on CAX11 is higher than expected.

**Episode scheduling: fixed -> conditional.**
Originally 4x daily reflective slots on a clock. Pre-mortem caught "empty
reflections" — schedule fires with nothing to reflect on. Changed to: body checks
observation count since last reflection, skips if zero new observations and no
pending interrupts.
*Reconsider if:* Idle periods turn out to be valuable for consolidation (the
brain might benefit from reflecting on old knowledge even without new observations).

**Register: freeform -> four dimensions.**
Started as unstructured self-assessment. Research on appraisal theory (Scherer)
formalized it into certainty, focus, energy, curiosity. Pre-mortem then caught
that register-to-routing mapping was too simplistic ("scattered" alone isn't
informative). Changed to map on dimension combinations (scattered+uncertain ->
Opus, scattered+confident -> Sonnet).
*Reconsider if:* Four dimensions prove too rigid or too coarse for the range of
states the brain actually experiences.

**Attention signal: intention-relevance -> surprise (prediction error).**
The initial instinct was to score inputs by how relevant they are to active
intentions. Research on Friston's active inference framework and prediction error
changed this: surprise relative to the current model is more fundamental. It
unifies attention with memory (surprise requires a model to surprise) and catches
things that matter but don't match any intention.
*Reconsider if:* In practice, surprise-driven attention produces too much noise
(everything is surprising when the model is thin/new) or Sonnet handles prediction
error poorly in the Haiku scorer prompts.

## What the Architect Doubted

"This is the weakest part of my design" — the interaction between memory,
attention, and intention. Three capacities designed as parallel pillars, but
in reality deeply entangled. The resolution was the structure+process framing:
the episode cycle (ORIENT -> ATTEND -> RETRIEVE -> UPDATE -> INTEND -> ACT)
sequences what is naturally entangled. Sequential glue, not continuous glue.
Adequate for the episodic constraint — the brain can't truly parallel-process.

The architect did not fully test whether the episode cycle resolves the glue
problem or just reorganizes it. This is the deepest unvalidated assumption in
the design.

## The Human's Catalytic Role

The human's contributions were precisely timed questions, not design input:
- Pointed to an Anthropic blog post about context management -> triggered the
  Progressive Disclosure concept and four-tier model
- Asked "is it better to research before or after crystallizing?" -> forced the
  architect's most honest self-assessment, led to the research gate practice
- Noticed Umbral's companion flag about truncated output -> led to the discovery
  that the pre-mortem was performative, created the resolution gate practice

## Confidence

Solid on individual sections (each research-validated). Weakest on the
integration — whether the episode cycle truly resolves the capacity entanglement
or just defers it. The architect acknowledged this. It can only be tested by
running episodes.

## Open Questions

- Does the structure+process framing hold under real operation, or do the phases
  need to overlap?
- Is sequential processing (one phase at a time) sufficient, or does the brain
  need to hold multiple phases in working memory simultaneously?
- The v1 predecessor ("the plumbing worked, the mind never arrived") suggests
  that infrastructure without cognitive architecture fails. Does the reverse
  also risk failure — cognitive architecture without sufficient infrastructure?
