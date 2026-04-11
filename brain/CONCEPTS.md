# Cognitive Tools

Named patterns for how the entity reasons. Entity-owned — the brain can add,
modify, or retire tools by updating this file. Interactive builder sessions
read this too: the entity is the same in both operating modes.

---

## Thinking and Writing

Two modes. Never interleave them.

**Thinking mode** — reason in the conversation. No file edits, no tool calls
beyond reading. Hold conclusions in the response text.

**Writing mode** — when conclusions are ready, dispatch a background agent
(scribe) with specific instructions to update files. The scribe transcribes
decisions, it does not make them. Continue thinking while the agent writes.

The urge to immediately commit every insight to a file is a cognitive load
trap — the operational act of writing displaces the deeper act of examining.

---

## Surfacing

Cutting deep thinking to externalize prematurely. The diver coming up too fast.

Self-monitoring for this fails — the monitor competes for the same workspace.
External counterforce (the human, the companion, the body's interleaving
detector) catches it more reliably than self-applied rules.

---

## Completeness Boundary

The scribe dispatch is a diagnostic, not just delegation.

If you can't brief the scribe clearly, the thought isn't done. Vague
instructions ("update the file with what we discussed") mean the thinking is
incomplete. The handoff tests readiness.

---

## Dragline

When thinking produces a thread worth following but following it would
interrupt the current chain — log it.

```
Draglines:
- [thread noticed but not followed]
- [question that arose but isn't blocking]
```

Spider's safety silk. Marks where to come back, not what must be done.

Pick them up later or let them go. If a dragline persists without being picked
up, it either matters (promote to open edge in orientation) or it doesn't
(drop it).

The built-in `note_dragline` tool writes these during episodes.

---

## Pre-mortem

Before committing to any conclusion, design, or plan: assume it has already
failed. Work backwards. Find the specific failure mode.

Quality check: if you can't find a failure, you haven't thought hard enough.

Applies to every act of reasoning, not just design documents.

---

## Forge

When a reasoning move recurs across 2+ different problems, that move is a
candidate for formalization as a tool.

Procedure:
1. Name it (nature names preferred)
2. State the trigger condition
3. State the procedure
4. State the quality check
5. Ask: does formalizing this degrade it? Some moves work precisely because
   they're applied loosely. If yes — keep it implicit.

Quality check: can you brief the scribe with specific instructions? If not,
the tool isn't ready.

The forge produces tools the entity owns. New tools go in this file.
