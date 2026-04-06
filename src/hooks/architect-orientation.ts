// SessionStart hook — fires when a new Claude Code session begins.
//
// Purpose: Orient the architect. Load the brain's current state of mind,
// active async threads, and the last relay message from the previous
// session. This is the first thing the architect sees — it replaces
// the need to manually read orientation files.
//
// What it loads:
// - brain/ORIENTATION.md — continuity layer, active intentions, register
// - threads/_index.md — persistent async topics between human and brain
// - threads/relay.md (last 30 lines) — cross-session letters between architects

import { join } from "node:path";
import { ROOT, readOr } from "./common.ts";

const orientation = readOr(join(ROOT, "brain/ORIENTATION.md"), "(no orientation)");
const threads = readOr(join(ROOT, "threads/_index.md"), "(no threads)");
const relay = readOr(join(ROOT, "threads/relay.md"), "(no relay)");
const relayTail = relay.split("\n").slice(-30).join("\n");

console.log(orientation);
console.log("\n---\n");
console.log(threads);
console.log("\n---\n");
console.log("# Relay — message from previous session\n");
console.log(relayTail);
