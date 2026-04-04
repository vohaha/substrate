---
paths:
  - bin/**
  - services/**
---

## Error Handling Standard

Every external operation (DB query, HTTP fetch, file read, shell exec) must have
both outcomes handled and visible.

- **No empty `catch {}`** — at minimum log the error.
- **No bare `2>/dev/null`** without a `||` fallback that logs or returns a default.
- **Failures must include context**: what was attempted, what input caused it,
  and whether the system can continue (degraded) or must stop (fatal).
- **Silent success is OK** for high-frequency operations.
  **Silent failure never is.**
