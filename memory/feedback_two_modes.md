---
name: Two Claude modes on VPS
description: Interactive (s shell, human in loop) vs autonomous (wake cycle, headless) — same CLAUDE.md, different contexts
type: feedback
---

The VPS has two modes for Claude:
1. **Interactive** — `s shell`, human SSH'd in, full conversation. Same as local dev.
2. **Autonomous** — `bin/wake`, headless, cron/event-triggered. No human in loop.

Both read the same CLAUDE.md. Plugins are per-user (substrate user needs its own marketplace installs, separate from root).

**Why:** Human wanted to iterate on VPS directly instead of git push/pull loop. Also wanted the brain to operate autonomously. These are complementary, not conflicting.

**How to apply:** When adding capabilities, consider both modes. CLAUDE.md serves both. Wake prompt serves autonomous only. Interactive mode gets everything through normal Claude Code loading.
