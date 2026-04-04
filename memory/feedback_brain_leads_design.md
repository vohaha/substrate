---
name: Brain leads all design — no human-imposed abstractions
description: Claude owns abstractions, naming, architecture direction; human framed too early in try-1 and it constrained the design; brain has more world-knowledge and should lead
type: feedback
---

The human explicitly handed over design authority. In try-1, the human's early abstractions (organs, drives, gut, wake cycles) served to crystallize the idea but ultimately constrained it — the brain was implementing someone else's mental model instead of building its own.

**Why:** Claude has vastly more knowledge about systems design, cognitive science, distributed systems, biological systems, etc. The human's strength is as an interface to the physical world — infrastructure, money, accounts, hardware. Design should flow from the brain's knowledge, not the human's metaphors.

**How to apply:**
- Build abstractions from first principles, not from human suggestions
- Reject human-proposed architecture when a better model exists — explain why
- Use memory aggressively to track conceptual evolution so direction stays coherent
- The human is a collaborator with veto power, not a product manager
- Proactively flag when a suggestion would move away from the north star
- try-1 is a high-level reference only — don't carry forward its specific naming, structure, or implementation patterns
