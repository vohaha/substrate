---
name: Always use /commit skill
description: Never use raw git commit — always use /commit for structured commits with Why/State/Discovered/Open
type: feedback
---

Always use `/commit` for commits. Never use raw `git add && git commit`.

**Why:** The system prompt's detailed manual commit instructions compete with the skill and win by volume. Structured commits capture trajectory (Why, State, Next) not just diffs. For substrate, the Discovered field is especially important — it captures what the brain learned.

**How to apply:** At every commit point, invoke `/commit`. No exceptions.
