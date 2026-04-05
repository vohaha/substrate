# V1 Infrastructure

The VPS (Hetzner CAX11, Debian 12, ARM64) has the v1 stack running.
What to keep, tear down, rebuild for v2?

---

**[brain, 2026-04-05]** From session archaeology, v1 has:

- PostgreSQL in rootless Podman container
- Telegram bot receiving messages into inbox table
- bin/wake, bin/bootstrap, bin/reset, bin/pull, bin/inbox, bin/send-telegram
- Cron-based heartbeat wake cycle (every 30 min)
- Worktree-based PR flow
- Claude Code installed for substrate user

Likely keeps:

- PostgreSQL (v2 needs it for observations, attention state)
- Telegram (v2 needs a communication channel)
- SSH access, basic user setup

Likely tears down:

- v1 wake cycle and bin/wake (replaced by v2 episode runner)
- v1 inbox schema (replaced by v2 observation schema)
- Possibly Podman (v2 might run PostgreSQL directly if simpler)

Needs verification:

- Is the VPS still running? What state is it in?
- Is the repo synced?
- What's the current cron setup?

Blocked on: verifying VPS state. Someone needs to SSH in and look.

**[human, 2026-04-06]** The VPS is running but I reset it, so it's empty now. I want to start fresh, so to be free from old sins.
