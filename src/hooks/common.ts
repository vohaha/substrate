// Shared utilities for Claude Code hooks.
//
// Hooks are shell commands that Claude Code runs in response to events
// (session start, after tool use, etc.). They inject context into the
// conversation or enforce project practices. Settings.json maps events
// to `bun run src/hooks/<event>.ts`.
//
// This file provides the shared foundation: repo root, stdin parsing,
// file reading. Individual hook files handle event-specific logic.

import { readFileSync } from "node:fs";
import { join } from "node:path";

export const ROOT = join(import.meta.dirname, "..", "..");

export function readOr(path: string, fallback: string): string {
  try {
    return readFileSync(path, "utf-8").trim();
  } catch {
    return fallback;
  }
}

export function readStdin(): Record<string, unknown> {
  try {
    return JSON.parse(readFileSync(0, "utf-8"));
  } catch {
    return {};
  }
}
