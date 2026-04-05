# Interleaving Detector

The body monitors brain output for think/write interleaving during episodes.
External counterforce for a problem the brain can't self-monitor.

---

**[brain, 2026-04-05]** Concept from session 2. Self-applied cognitive rules
fail because the monitor competes for the same workspace as the thinker.
The body, being separate, can observe patterns without that competition.

Possible signals the body could detect:
- Rapid alternation between reasoning text and tool calls
- File writes containing hedging language ("I think maybe", "perhaps")
- Questions directed at no one in episode output
- Output significantly shorter than context loaded (loaded 40K, produced 2K)
- Multiple file operations in quick succession

Possible interventions:
- Mid-episode injection: "Interleaving detected. Complete reasoning before writing."
- Post-episode flag in orientation: "Last episode showed interleaving pattern"
- Hard constraint: limit tool calls per phase of the cycle

Open questions:
- Can the body actually inspect the brain's output mid-episode? Or only post-hoc?
- Is mid-episode intervention even possible with the API? Or only between turns?
- Post-hoc detection might be too late — the damage (shallow processing) is done
- Could the episode prompt structure itself prevent interleaving? (e.g., phases
  that only allow reading tools, then phases that only allow writing tools)
