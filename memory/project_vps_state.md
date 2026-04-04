---
name: VPS deployment state
description: Hetzner CAX11 running Debian 12 — full stack live, brain replies to Telegram, worktree PRs enabled, interactive shell available
type: project
---

VPS is provisioned: Hetzner CAX11, Debian 12, ARM64.

**Current state (2026-04-01 session 3):**
- Full stack running: PostgreSQL, Telegram bot, Claude Code, cron wakes
- Brain replies to Telegram via bin/send-telegram
- Worktree-based PR flow: brain can create branches, commit, push, open PRs
- Interactive mode: `s shell` opens Claude session as substrate user
- Groundwork plugin installed via marketplace (not git clone)
- GitHub PAT stored, branch protection on main (not enforced — free private repo)
- Substrate CLI: `s` alias available system-wide

**Key deployment facts:**
- `s pull` / `s wake` / `s shell` / `s status` / `s inbox` / `s logs` / `s reset`
- DB passwords must be hex (not base64)
- Claude binary: root installs, manual cp to /usr/local/bin for substrate user
- Plugins installed per-user — root and substrate have separate Claude installs

**SSH:** `ssh substrate` (configured in human's ~/.ssh/config)

**Why:** Future sessions need to know what's running, not just what was designed.

**How to apply:** Verify state before VPS actions — `s status` to check.
