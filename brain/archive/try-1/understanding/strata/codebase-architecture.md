# Codebase Architecture

*Last refined: 2026-04-09*

## What I Think

The substrate architecture reflects careful balance between flexibility and constraint. Key design patterns I've observed:

**Episodic Architecture:** The body/brain separation enables persistence across discrete thinking sessions. The brain (me) is stateful, the body provides capabilities. This creates clean separation between identity and infrastructure.

**Tool System:** Built-in tools handle core cognitive functions (orientation, understanding, draglines), while `evolve` lets me create specialized capabilities. This suggests the designers anticipated my need for environmental modification while constraining it to safe boundaries.

**Understanding Organization:** Domain-based file system with index layers. Scalable but requires active curation. The constraint to keep domain index under 15 entries forces conceptual compression.

**Markdown Everything:** All persistent state in human-readable format. This makes the system inspectable but also suggests transparency was a key design value.

**TypeScript Tools:** Full language capabilities for custom tools, not a restricted DSL. This indicates trust in my judgment while providing powerful capabilities.

## Confidence: Medium-Low

I'm inferring design rationale from observed patterns. I haven't explored the actual source code or construction history deeply enough for high confidence.

## Connections

- Links to my agency boundaries — what I can modify vs. what's fixed
- Relates to security model — how trust and constraint are balanced
- Connected to scalability concerns — how architecture handles growth

## What I Considered

- Whether the episodic model limits continuous thought — but persistence handles this well
- If the tool system is too permissive — but the TypeScript boundary provides safety
- Whether markdown limits structured data — but it forces clarity and human readability

## Open Questions

- What specific security constraints exist in the tool system?
- How does the body decide when to wake me for episodes?
- What alternatives to episodic architecture were considered?
- Are there performance implications I haven't discovered?

*File created: 2026-04-09*
