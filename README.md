# Substrate — Setup Guide

Setting up substrate on a fresh VPS.

## Prerequisites

- A fresh Debian VPS (ARM64 or x86)
- Root SSH access to it
- Your SSH public key already authorized for root
- An Anthropic API key (`sk-ant-...`)

---

## Step 1 — SSH in as root

```bash
ssh root@<VPS_IP>
```

## Step 2 — Install git and clone the repo to `/substrate`

Git isn't installed on a fresh VPS yet — bootstrap does it, but bootstrap needs the repo first:

```bash
apt-get update && apt-get install -y git
```

The VPS has no SSH key to authenticate with GitHub. Generate one and add it as a deploy key:

```bash
ssh-keygen -t ed25519 -C "soma@substrate" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Copy the output, then add it to the repo on GitHub: **Settings → Deploy keys → Add deploy key**. Read-only access is enough.

Then clone:

```bash
git clone git@github.com:vohaha/substrate.git /substrate
```

The bootstrap script expects the repo at exactly `/substrate`. Don't clone it elsewhere.

## Step 3 — Run bootstrap

```bash
bash /substrate/bin/bootstrap
```

Idempotent — safe to re-run. It will:

- Install system packages (`git`, `curl`, `jq`, `unzip`, `sudo`)
- Create the `soma` user
- Copy your root SSH authorized keys to `soma` so you can SSH in as `soma`
- Give `soma` passwordless sudo
- Disable root SSH login
- Set hostname to `substrate`
- Install Node.js and Claude Code CLI
- Install Bun for `soma`
- Fix ownership of `/substrate` to `soma`
- Install Node dependencies (`bun install`)
- Create the Claude Code memory symlink (`~/.claude/projects/.../memory` → `/substrate/memory`)
- Create the API key directory at `~/.config/substrate/`

## Step 4 — SSH in as soma and store the API key

Root login is now disabled. Switch to soma:

```bash
ssh soma@<VPS_IP>
```

Store the API key:

```bash
/substrate/bin/set-key sk-ant-...
source ~/.bashrc
```

## Step 5 — Run the genesis episode

```bash
/substrate/bin/episode reflective-genesis
```

The brain's first wake. Reads `brain/ORIENTATION.md`, assembles context, calls the API, and updates orientation with whatever it produces.

---

## What bootstrap does NOT do

- Set up any database — not needed yet
- Generate SSH keys for `soma` to push back to git — add if you need the body to commit

## Troubleshooting

| Symptom | Fix |
|---|---|
| `FATAL: Run as root` | Run with `sudo bash bin/bootstrap` or switch to root first |
| `WARN: Repo not found at /substrate` | Clone the repo to `/substrate` before running bootstrap |
| `WARN: Memory directory exists (not a symlink)` | Check for files in that dir, then `rm -rf` it and re-run |
| `bun: command not found` during bootstrap | Fixed — bootstrap uses full path `~/.bun/bin/bun` |
| Episode exits: no API key | Run `set-key` (Step 4) |
