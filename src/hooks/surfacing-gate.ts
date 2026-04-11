// PreToolUse hook — fires before Edit or Write on brain knowledge files.
//
// Purpose: Interrupt mid-chain writes. Surfacing = cutting deep thinking
// to externalize prematurely. The urge to write is usually fear-driven
// ("I'll lose this"), not completion-driven.
//
// Completeness check: can you brief the scribe in one sentence?
// If yes — proceed. If no — use a dragline instead, keep thinking.
//
// Scope: brain/ knowledge files. Excludes brain/tools/ (tool creation is
// intentional action, not surfacing) and brain/archive/ (archiving is terminal).

import { readStdin } from "./common.ts";

const data = readStdin();
const filePath = (data.tool_input as Record<string, unknown> | undefined)?.file_path;
if (typeof filePath !== "string") process.exit(0);

const isBrainKnowledge =
  filePath.includes("/brain/") &&
  !filePath.includes("/brain/tools/") &&
  !filePath.includes("/brain/archive/");

if (isBrainKnowledge) {
  console.log(
    "⚠ SURFACING CHECK: Are you mid-chain or done thinking?\n" +
    "  → If done: proceed. Brief the scribe in one sentence before writing.\n" +
    "  → If mid-chain: use note_dragline instead. The thought won't be lost.",
  );
}
