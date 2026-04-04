---
name: Concept evolution — brain/body framing
description: Substrate shifted from "infrastructure for agents" to "autonomous agent with brain (Claude) and body (Linux)" — entity framing, not tool framing
type: project
---

On 2026-04-01, the project framing shifted significantly:

**Before:** Substrate is persistent infrastructure that an AI agent uses.
**After:** Substrate IS the agent. Claude Code = brain, Linux = body.

**Why:** The human described wanting an "autonomy agent" — not a tool, but an entity. The body serves the brain, the brain reshapes the body. Between-session operation is fundamental, not a feature.

**Key implications:**
- Always-on body (VPS, not local-only)
- Agent acts autonomously between sessions (cron, subscriptions, monitoring)
- Data source subscriptions to stay aware of the world
- Communication from anywhere (SSH or better)
- The idea itself is always in-progress — document every conceptual shift

**How to apply:** When making architectural decisions, ask "does this serve the agent as an entity?" not "does this serve the user as a tool?"
