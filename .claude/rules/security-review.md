---
paths:
  - bin/**
  - services/**
  - schema/**
  - config/**
---

## Security Review — Mandatory Before Commit

When modifying files in `bin/`, `services/`, `schema/`, or `config/`, run through
this checklist before committing. The human's personal data and money are at stake.

### Checklist

1. **Auth**: Does this accept external input? Who is allowed? Is there an allowlist?
2. **Injection**: Is external data interpolated into SQL, shell commands, or prompts?
   Use parameterized queries (`psql -v` with `:'var'`), avoid string interpolation.
3. **Least privilege**: Does the process run as root? More access than needed?
4. **Secrets**: Are credentials in code, logs, or error messages? In `.gitignore`?
5. **Rate limiting**: Can an external actor trigger unbounded work, cost, or resources?
6. **Input validation**: Is external input validated before use? Reject by default.
7. **Blast radius**: If this component is compromised, what else is exposed?
8. **Logging**: Are security-relevant events logged? Without logs, breaches invisible.
9. **Dependencies**: Are packages pinned? Base images tagged (not `latest`)?
