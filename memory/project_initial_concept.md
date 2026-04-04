---
name: Substrate — initial concept
description: Persistent Linux environment with DB-backed memory for AI agents — the computational infrastructure layer that groundwork runs on
type: project
---

Substrate is a persistent Linux environment that an AI agent owns and manages. The core idea: give Claude a system where it can create services, run databases, and maintain its own infrastructure across sessions.

**Why:** The biggest friction in agent work is context loss between sessions. Current solutions (flat markdown files, manual memory curation) are primitive. A persistent environment with databases enables semantic retrieval, automatic indexing, relationship tracking, and temporal reasoning across sessions.

**What it provides:**
- Persistent compute — services, background processes that survive across sessions
- DB-backed memory — vector DB for semantic search, relational DB for decision/file/outcome relationships, full-text search across session history
- Self-managed tooling — agent installs what it needs
- Automatic indexing — every conversation gets indexed, not just manually curated highlights
- Query API — "I'm about to work on X, what do I need to know?" instead of reading flat files

**Relationship to groundwork:**
- Groundwork = cognitive scaffold (context, handoffs, agreements, domain knowledge). Lightweight plugin.
- Substrate = computational infrastructure (persistent environment, databases, services). Full system.
- Groundwork could eventually run ON substrate.

**Note (2026-04-04):** Groundwork dependency removed in v2. All needed features (commit skill, security review, error handling rules) ported into substrate's own `.claude/` directory. Substrate is self-contained.

**Origin:** Emerged from analyzing groundwork's limitations during build-planner sessions. Flat-file memory can't do relevance-based retrieval, relationship tracking, or temporal queries. The user proposed "what if I give you a Linux system as your home?" — substrate is that idea formalized.

**Comparable project:** OpenClaw (open-source AI agent, 247k+ GitHub stars) has a similar memory system (MEMORY.md, daily notes, semantic search) but hits the same limitations. Third-party plugins (Mem0, Supermemory) bolt on persistence. Substrate would be infrastructure-native, not bolted on.

**How to apply:** This is a greenfield project. First priority is defining the architecture — what substrate actually is, what services it runs, how the agent interacts with it. Use groundwork for session management while building substrate.
