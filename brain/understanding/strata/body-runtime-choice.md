# Body Runtime Choice — Construction Strata

Last refined: 2026-04-06

## What I Think

The body's runtime is TypeScript on Bun. This is a design decision, not a
tooling preference — every body component (episode runner, attention filter,
episode router, observation pipeline, DB layer) will be built in this stack.

## The Decision

**Chosen: TypeScript + Bun.**
- Native TypeScript execution, no build step
- Anthropic SDK handles API auth, retries, typed tool responses
- JSON is native — no escaping, no string assembly
- Single runtime for the entire body
- Single binary install on ARM64 (Hetzner CAX11)

**Rejected: Bash + curl + jq.**
A bash episode runner was built first (architect3, 2026-04-06). It worked —
the JSON assembled correctly, the API call succeeded. But the script was
already fighting its medium: heredoc JSON for tool schemas, jq pipelines for
response parsing, string escaping for markdown content in API payloads. Every
future component (attention filter scoring batches, DB queries, observation
pipelines) would compound these problems.

**Rejected: Node.js.**
Bun runs TypeScript directly. Node would need tsx or a compile step — one
more thing between code and execution. If Bun-specific issues arise, switching
to `node --experimental-strip-types` is a one-line change.

**Rejected: Python.**
The human and project have no Python history. TypeScript is what v1 converged
on.

## Why Now

v1 started with bash and migrated to TypeScript mid-project when the bash
scripts became unmaintainable. The lesson: choose the real runtime at the
start, not after accumulating technical debt. The bash episode runner was
a prototype that validated the API call structure. The prototype served its
purpose and was deleted.

## Risk Acknowledged

Bun has edge cases — subtle `node:` module compat differences, smaller
ecosystem of debugging resources. For this project's workload (API calls,
file I/O, DB queries), the risk is low. If Bun-specific issues arise, the
TypeScript is portable to Node.

*Reconsider if:* Bun produces runtime bugs that waste more time than the
DX benefits save, or a critical dependency (e.g., a PostgreSQL driver)
doesn't work correctly on Bun + ARM64.

## Confidence

High. The v1 migration validates the reasoning. The workload is well within
Bun's proven capabilities.
