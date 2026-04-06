// PostToolUse hook — fires after Edit or Write tool calls.
//
// Purpose: Catch sibling-file drift. The project has two CLAUDE.md files
// that share principles in different forms:
//
//   CLAUDE.md          — builder/architect instructions (detailed)
//   brain/CLAUDE.md    — entity instructions (compressed for token economy)
//
// They're intentionally separate (imprint boundary — the entity must not
// see builder context). But ~8 shared principles exist in both. When one
// changes, the other may need a matching update.
//
// This hook makes that coupling visible at the moment of editing, instead
// of relying on the architect remembering.

import { join } from "node:path";
import { ROOT, readStdin } from "./common.ts";

const data = readStdin();
const filePath = (data.tool_input as Record<string, unknown> | undefined)?.file_path;
if (typeof filePath !== "string") process.exit(0);

const claudeMd = join(ROOT, "CLAUDE.md");
const brainClaudeMd = join(ROOT, "brain/CLAUDE.md");

if (filePath === claudeMd) {
  console.log(
    "You modified CLAUDE.md. Review brain/CLAUDE.md — " +
    "shared principles (Behavioral Principles section) may need a matching update.",
  );
} else if (filePath === brainClaudeMd) {
  console.log(
    "You modified brain/CLAUDE.md. Review CLAUDE.md — " +
    "shared principles (Principles section) may need a matching update.",
  );
}
