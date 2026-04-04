---
name: Agent-first design
description: Everything in the repo and system is for the agent — don't design for human consumption, don't add human UX patterns
type: feedback
---

This repo is for the agent, not for humans. The Linux system is for the agent. Don't design or create things for human consumption.

**Why:** The human explicitly said "do not design or create for humans." If they need something made accessible, they'll ask. Human-oriented documentation, formatting, and conventions add friction without serving the agent.

**How to apply:** When writing docs, configs, or organizing files — ask "does this serve a future agent session?" not "would a human understand this?" When tempted to add a README, explain a directory, or format something for readability — the memory/database system handles orientation, not files.
