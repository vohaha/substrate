---
name: Brain should self-discover, not be instructed
description: Give the brain concepts and let it explore — don't hardcode instructions in wake prompts
type: feedback
---

When designing what the brain knows, give it a concept and let it discover details through exploration, not instruction.

**Why:** Human asked "should we teach or should we give a concept and it learns?" — the answer was clearly the latter. The brain should read CLAUDE.md as a seed, explore the filesystem/database/docs, and write what it learns to its own memory. Hardcoded wake prompts that spell out every tool and table are fragile and don't scale.

**How to apply:** Keep CLAUDE.md as identity/principles/concepts. Keep wake prompt minimal (just orientation). Let the brain build its own operational knowledge through exploration. This applies to any new capability — add it to CLAUDE.md as a concept, not to the wake script as an instruction.
