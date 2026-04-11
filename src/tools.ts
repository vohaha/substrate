import type Anthropic from "@anthropic-ai/sdk";
import { type } from "arktype";
import { readFile, writeFile, appendFile, mkdir, unlink } from "node:fs/promises";
import { join, resolve } from "node:path";
import { RESERVED_NAMES, BRAIN_TOOLS_DIR, importBrainTool } from "./brain-tools.ts";

const BRAIN_DIR = join(import.meta.dirname, "..", "brain");
const REPO_ROOT = join(import.meta.dirname, "..");

// --- Tool definitions ---

export const tools: Anthropic.Messages.Tool[] = [
  {
    name: "read_file",
    description:
      "Read any file in the repository. Returns the file contents, " +
      "capped at maxLines to prevent context overflow.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Path relative to the repository root.",
        },
        maxLines: {
          type: "number",
          description: "Maximum lines to return. Default 200.",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "write_file",
    description:
      "Write a file anywhere under brain/. Creates directories as needed. " +
      "You decide the structure — nothing is prescribed.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Path relative to brain/ (e.g., 'ORIENTATION.md', 'notes/thought.md').",
        },
        content: {
          type: "string",
          description: "The full file content.",
        },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "note_dragline",
    description:
      "Log a thought worth returning to without interrupting the current chain. " +
      "Append-only — low friction capture. Pick them up later or let them go.",
    input_schema: {
      type: "object" as const,
      properties: {
        thought: {
          type: "string",
          description: "The thread, question, or observation to capture.",
        },
      },
      required: ["thought"],
    },
  },
  {
    name: "evolve",
    description:
      "Create, update, or delete a brain tool. Tools persist as TypeScript " +
      "files in brain/tools/ and are loaded every episode. The source must " +
      "export `definition` (Anthropic.Messages.Tool) and `handler` " +
      "(async (input: Record<string, unknown>) => Promise<string>). " +
      "Cannot modify built-in tools. Full Node/Bun APIs available via import.",
    input_schema: {
      type: "object" as const,
      properties: {
        action: {
          type: "string",
          enum: ["create", "update", "delete"],
          description: "What to do.",
        },
        name: {
          type: "string",
          description: "Tool name. Lowercase with underscores. Becomes brain/tools/<name>.ts.",
        },
        rationale: {
          type: "string",
          description: "Why this tool is being created, changed, or removed.",
        },
        source: {
          type: "string",
          description:
            "Full TypeScript source code. Required for create/update. " +
            "Must export `definition` (Anthropic.Messages.Tool) and " +
            "`handler` (async (input: Record<string, unknown>) => Promise<string>).",
        },
      },
      required: ["action", "name", "rationale"],
    },
  },
];

// --- Sanitize path components (for evolve tool names) ---

function sanitize(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9_.-]/g, "");
  if (!clean || clean === "." || clean === "..") {
    throw new Error(`Invalid path component: '${name}'`);
  }
  return clean;
}

// --- Tool response handler ---

export interface EpisodeOutput {
  filesRead: string[];
  filesWritten: string[];
  draglinesLogged: number;
  toolsEvolved: number;
}

// --- Input schemas ---

const draglineSchema = type({ thought: "string" });
const readFileSchema = type({ path: "string", "maxLines?": "number" });
const writeFileSchema = type({ path: "string", content: "string" });
const evolveSchema = type({
  action: "'create' | 'update' | 'delete'",
  name: "string",
  rationale: "string",
  "source?": "string",
});

function parseOrThrow<T>(result: T | import("arktype").type.errors): T {
  if (result instanceof type.errors) {
    throw new Error(result.summary);
  }
  return result;
}

export async function handleToolCall(
  block: Anthropic.Messages.ToolUseBlock,
  output: EpisodeOutput,
  log: (msg: string) => void,
): Promise<{ result: string; isError: boolean } | null> {
  try {
    switch (block.name) {
      case "note_dragline": {
        const { thought } = parseOrThrow(draglineSchema(block.input));
        const logPath = join(BRAIN_DIR, "draglines.log");
        const entry = `[${new Date().toISOString()}] ${thought}\n`;
        await appendFile(logPath, entry);
        output.draglinesLogged++;
        log(`Dragline: ${thought.slice(0, 80)}`);
        return { result: "logged", isError: false };
      }

      case "read_file": {
        const { path: relPath, maxLines } = parseOrThrow(readFileSchema(block.input));
        const limit = maxLines ?? 200;
        const fullPath = resolve(REPO_ROOT, relPath);

        // Security: reject traversal outside repo
        if (!fullPath.startsWith(REPO_ROOT + "/") && fullPath !== REPO_ROOT) {
          return { result: "error: path escapes repository root", isError: true };
        }

        log(`Reading: ${relPath}`);
        let content: string;
        try {
          content = await readFile(fullPath, "utf-8");
        } catch {
          return { result: `error: file not found: ${relPath}`, isError: true };
        }

        const lines = content.split("\n");
        const truncated = lines.length > limit;
        const result = lines.slice(0, limit).join("\n");
        output.filesRead.push(relPath);

        return {
          result: truncated
            ? `${result}\n\n--- truncated at ${limit}/${lines.length} lines ---`
            : result,
          isError: false,
        };
      }

      case "write_file": {
        const { path: relPath, content } = parseOrThrow(writeFileSchema(block.input));
        const parts = relPath.split("/").filter(Boolean);
        if (parts.length === 0) {
          return { result: "error: path is empty", isError: true };
        }
        const safeParts = parts.map(sanitize);
        const fullPath = join(BRAIN_DIR, ...safeParts);

        const parentDir = join(BRAIN_DIR, ...safeParts.slice(0, -1));
        await mkdir(parentDir, { recursive: true });

        log(`Writing: brain/${safeParts.join("/")}`);
        await writeFile(fullPath, content + "\n");
        output.filesWritten.push(`brain/${safeParts.join("/")}`);

        // Orientation length check
        if (safeParts.join("/") === "ORIENTATION.md") {
          const tokenEstimate = Math.ceil(content.length / 4);
          if (tokenEstimate > 1500) {
            log(`WARN: Orientation is ~${tokenEstimate} tokens (target ≤1500). Consider trimming.`);
          }
        }

        return { result: `wrote brain/${safeParts.join("/")}`, isError: false };
      }

      case "evolve": {
        const { action, name, rationale, source } = parseOrThrow(evolveSchema(block.input));

        if (RESERVED_NAMES.has(name)) {
          return { result: `error: '${name}' is a reserved built-in tool`, isError: true };
        }

        let safeName = sanitize(name);
        if (safeName.endsWith(".ts")) safeName = safeName.slice(0, -3);
        const toolsDir = BRAIN_TOOLS_DIR;
        const filePath = join(toolsDir, `${safeName}.ts`);

        if (action === "delete") {
          try {
            await unlink(filePath);
            log(`Evolved: deleted tool ${safeName} (${rationale})`);
            output.toolsEvolved++;
            return { result: `deleted brain/tools/${safeName}.ts`, isError: false };
          } catch {
            return { result: `error: tool '${safeName}' not found`, isError: true };
          }
        }

        if (!source) {
          return { result: "error: source is required for create/update", isError: true };
        }

        await mkdir(toolsDir, { recursive: true });
        await writeFile(filePath, source + "\n");

        try {
          await importBrainTool(filePath);
        } catch (err) {
          await unlink(filePath);
          const msg = err instanceof Error ? err.message : String(err);
          return { result: `error: tool validation failed: ${msg}`, isError: true };
        }

        log(`Evolved: ${action}d tool ${safeName} (${rationale})`);
        output.toolsEvolved++;
        return {
          result: `${action}d brain/tools/${safeName}.ts — available next turn`,
          isError: false,
        };
      }

      default:
        return null;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log(`ERROR in ${block.name}: ${msg}`);
    return { result: `error: ${msg}`, isError: true };
  }
}
