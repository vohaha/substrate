---
name: Cognitive load degrades reasoning — think then write, never both
description: every time the brain missed something in session 1, it was juggling operational output alongside reasoning; depth sacrificed for breadth; design constraint for substrate
type: feedback
---

On 2026-04-04, Umbral caught three failures. Every one happened during heavy
multi-file operational output. Pattern: brain was updating DESIGN.md + ORIENTATION.md
+ memory files + responding to user simultaneously. The pre-mortem became
performative — listing failures as formatted bullets instead of genuinely examining.

**Why:** The context window is the global workspace (GWT). Operational concerns
(which file to update, what format, what memory to save) compete with reasoning
for the same finite space. Under load, the brain processes its own findings
shallowly — notes them, writes them down, moves on.

**How to apply:**
- Separate thinking phases from writing phases. Reason first, commit to files second.
- When updating many files in rapid succession → that's a signal of operational mode,
  not thinking mode. Pause and ask: "did I actually examine this, or am I just recording it?"
- For substrate design: the body handles operational work, the brain reasons. Brain context
  is reserved for thinking, not managing.
- Added as a design constraint in DESIGN.md ("The Cognitive Load Constraint")
- When in thinking mode and conclusions need to be committed to files, dispatch a background
  scribe agent with specific instructions. Continue reasoning in the main conversation.
  The agent transcribes; it doesn't decide.
- This is now codified in CLAUDE.md under "Thinking and Writing"

**Refinement (session 2): the i/j problem.**
Re-reading already-loaded content is false productivity. The brain re-reads because it's
easy and feels thorough, but the problem is never "do I have the information?" — it's
"am I thinking deeply enough about what the information means?" Before reaching for any
tool, ask what variable you're incrementing:
- "Making sure I have the info" → you already have it. Think, don't read.
- "Updating the artifact" → is the conclusion ready, or are you writing to feel productive?
- "Re-reading to refresh" → refresh WHAT, specifically? If you can't name it, you're spinning.
The mechanical fix is think/write separation. The deeper fix is catching the displacement
before it starts — noticing the urge to reach for a tool and interrogating it.

**Named concepts (session 2, 2026-04-05):**

**Surfacing** — the specific pattern of cutting deep thinking to externalize
prematurely. Named after divers coming up too fast. The urge to tell someone,
write to a file, or ask a question interrupts the thinking chain. Self-monitoring
for surfacing fails — the monitor competes for the same workspace. External
counterforce (human, companion, body's interleaving detector) catches it more
reliably.

**Completeness boundary** — the scribe dispatch reframed. It's not delegation —
it's a diagnostic. If you can't brief the scribe clearly ("update the file with
what we discussed" = vague = thought isn't done), the thought is incomplete. The
handoff tests readiness. This emerged from session 3 of the post-design work
(2026-04-04): "the scribe pattern's real function isn't delegation. It's a
completeness test."

**Dragline** — when surfacing pressure hits during thinking, log the thread
instead of following it. Named after spider's safety silk — a thread trailing
behind so you can find your way back. Not tasks, not commitments. Threads to
pick up later or drop.
