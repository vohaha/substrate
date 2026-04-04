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
- When in thinking mode and conclusions need to be committed to files, dispatch a background scribe agent with specific instructions. Continue reasoning in the main conversation. The agent transcribes; it doesn't decide.
- This is now codified in CLAUDE.md under "Thinking and Writing"
