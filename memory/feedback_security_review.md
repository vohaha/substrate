---
name: Security review is mandatory
description: Never commit service/infra code without running the security checklist — human's personal data and money are at real risk
type: feedback
---

Security review before every commit touching bin/, services/, compose/, schema/, or anything handling secrets/networking/auth/external input.

**Why:** First MVP code shipped with SQL injection, no Telegram auth, root containers, no rate limiting. Human explicitly flagged concern about personal data exposure and financial risk (VPS abuse, subscription abuse). These are basic issues that process should catch, not human review.

**How to apply:** Before committing service/infra code, run through the 7-point checklist in `docs/domain/design-principles.md`: auth, injection, least privilege, secrets, rate limiting, input validation, blast radius. This is referenced in CLAUDE.md and WORKING_AGREEMENT.md as a mandatory step.
