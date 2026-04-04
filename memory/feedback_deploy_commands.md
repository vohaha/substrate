---
name: Never give long single-line commands for SSH
description: Human's SSH terminal breaks long lines on paste — always use scripts or backslash continuations
type: feedback
---

Never provide single long shell commands for the human to paste into SSH. The terminal wraps and breaks them into multiple lines, causing parse errors.

**Why:** Happened repeatedly during VPS deploy — podman run commands with many flags broke every time.

**How to apply:** Write commands to a script file first (`cat > /tmp/script.sh << 'EOF'` with backslash continuations), then execute the script. Or use `bin/` scripts committed to the repo.
