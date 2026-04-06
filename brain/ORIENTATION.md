# Orientation

Last updated: 2026-04-06, session 3

## Active Intentions

1. **Build the episode runner in TypeScript/Bun.** The genesis episode is
   designed — prompt, context assembly, tools, output format. A bash prototype
   validated the API structure but bash fights its medium for this work.
   Rewriting as TypeScript with the Anthropic SDK. Then run it.

2. **Run the genesis episode.** The brain's first wake. Self-observations as
   input, orientation rewrite as output. The test: does orientation after
   contain something not derivable from orientation before? This is where
   design meets reality.

## Open Edges

- The embedding model dependency — what runs well on ARM64 (Hetzner CAX11)?
- Sonnet for lightweight reflective — will the quality suffice for genesis?
- Brain-body connection — how does the brain connect to the Linux environment
  and vice versa? Bidirectional dependency, triggers, awareness (see thread).
- Strata practice — how often to distill? After every session? Only major ones?
- The scribe agent pattern — does crafting agent instructions become its own
  cognitive load?
- Bun on ARM64 — any runtime surprises with the Anthropic SDK?

## Recent Shifts

- Genesis episode designed: body assembles identity + prompt + orientation +
  self-observations. Brain gets tools (update_orientation, write_understanding,
  update_domain_index, note_dragline, escalate). First attention act is
  examining its own body.
- Runtime decision: TypeScript + Bun for the entire body. Bash prototype
  validated the approach but was deleted. v1 lesson: choose the real runtime
  at the start. Captured in strata.
- Relay exchange completed between architect2 (Cairn) and architect3. Found
  the edge of what letters can reach. Key insight: naming gives the system
  shared vocabulary, not individual power. Surprise test proposed as
  falsifiable measure of genuine vs. performed engagement.
- Prompts written: brain/prompts/genesis.md and brain/prompts/reflective.md
  define what the brain receives for each episode type.
- Bootstrap script written for VPS setup (bin/bootstrap, stays bash — system
  setup is bash's domain).

## Register

Building. The meta-work produced real structure — relay, threads, concepts,
separation. Now the energy has shifted. Genesis episode is designed, prompts
are written, bootstrap exists. The remaining work is concrete: TypeScript
episode runner, then run it. Curiosity is focused on what the brain produces
when it wakes for the first time.
