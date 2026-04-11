// PreToolUse hook — fires before Edit or Write on system-behavior files.
//
// Purpose: Remind the architect that changes to these files affect brain
// behavior and require a research basis citation (or explicit "unresearched"
// marker) in the commit.
//
// System-behavior files: src/, brain/CLAUDE.md, brain/prompts/, DESIGN.md, bin/episode
//
// This is the soft nudge. The hard stop is in create-commit.sh which
// rejects commits without --basis for these files.

import { readStdin } from "./common.ts";

const data = readStdin();
const filePath = (data.tool_input as Record<string, unknown> | undefined)?.file_path;
if (typeof filePath !== "string") process.exit(0);

const systemPaths = [
  "/src/",
  "/brain/CLAUDE.md",
  "/brain/prompts/",
  "/DESIGN.md",
  "/bin/episode",
];

const isSystemFile = systemPaths.some((p) => filePath.includes(p));

if (isSystemFile) {
  console.log(
    "⚠ RESEARCH GATE: This file affects brain behavior. " +
    "Commit will require --basis (cited mechanism or explicit 'unresearched'). " +
    "If no research basis exists, consider researching before proceeding.",
  );
}
