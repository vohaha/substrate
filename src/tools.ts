import type Anthropic from "@anthropic-ai/sdk";
import { type } from "arktype";
import { mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { RESERVED_NAMES, BRAIN_TOOLS_DIR, importBrainTool } from "./brain-tools.ts";

const BRAIN_DIR = join(import.meta.dirname, "..", "brain");
const UNDERSTANDING_DIR = join(BRAIN_DIR, "understanding");

// --- Tool definitions ---

export const tools: Anthropic.Messages.Tool[] = [
  {
    name: "update_orientation",
    description:
      "Rewrite the orientation file. This is your continuity — your state of mind " +
      "for the next episode. First person, under 1500 tokens. Include: active " +
      "intentions (2-3), open edges, recent shifts, register " +
      "(certainty/focus/energy/curiosity). " +
      "Do NOT include domain index content here — use update_domain_index for that.",
    input_schema: {
      type: "object" as const,
      properties: {
        rationale: {
          type: "string",
          description:
            "What is changing from the current orientation and why. " +
            "Required even on genesis — state what you are establishing.",
        },
        content: {
          type: "string",
          description: "The full new orientation content in markdown.",
        },
      },
      required: ["rationale", "content"],
    },
  },
  {
    name: "write_understanding",
    description:
      "Create or update an understanding file. Each file is a living document " +
      "about one concept. Include: what I think, confidence, connections, what " +
      "I considered, open questions, last refined date.",
    input_schema: {
      type: "object" as const,
      properties: {
        rationale: {
          type: "string",
          description: "What is changing or being established, and why. Reconsolidation safeguard.",
        },
        domain: {
          type: "string",
          description: "Domain directory name (e.g., 'self', 'infrastructure'). Created if needed.",
        },
        filename: {
          type: "string",
          description: "File name without path (e.g., 'body-architecture.md').",
        },
        content: {
          type: "string",
          description: "The full file content in markdown.",
        },
      },
      required: ["rationale", "domain", "filename", "content"],
    },
  },
  {
    name: "update_domain_index",
    description:
      "Rewrite the domain index. One line per domain with scope keywords. " +
      "Keep under 15 domains. This is always loaded — every token counts.",
    input_schema: {
      type: "object" as const,
      properties: {
        rationale: {
          type: "string",
          description: "What domains are being added or changed.",
        },
        content: {
          type: "string",
          description: "The full domain index content.",
        },
      },
      required: ["rationale", "content"],
    },
  },
  {
    name: "note_dragline",
    description:
      "Log a thread worth returning to later. Not a task or commitment — " +
      "a thread noticed but not followed.",
    input_schema: {
      type: "object" as const,
      properties: {
        thread: {
          type: "string",
          description: "Brief description of the thread to return to.",
        },
      },
      required: ["thread"],
    },
  },
  {
    name: "escalate",
    description:
      "Flag that this episode needs deeper processing than the current model " +
      "can provide. The body will schedule a deeper episode.",
    input_schema: {
      type: "object" as const,
      properties: {
        reason: {
          type: "string",
          description: "Why escalation is needed.",
        },
      },
      required: ["reason"],
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

// --- Domain sub-index maintenance ---

async function updateSubIndex(domainDir: string, filename: string, rationale: string): Promise<void> {
  const indexPath = join(domainDir, "INDEX.md");
  const domainName = domainDir.split("/").pop() ?? "unknown";
  let lines: string[];

  try {
    const existing = await readFile(indexPath, "utf-8");
    lines = existing.split("\n");
  } catch {
    lines = [`# ${domainName} — Domain Sub-Index`, ""];
  }

  // Check if file already listed, update if so
  const entryPrefix = `- ${filename}`;
  const newEntry = `- ${filename} — ${rationale}`;
  const existingIdx = lines.findIndex((l) => l.startsWith(entryPrefix));

  if (existingIdx >= 0) {
    lines[existingIdx] = newEntry;
  } else {
    lines.push(newEntry);
  }

  await writeFile(indexPath, lines.join("\n") + "\n");
}

// --- Sanitize path components ---

function sanitize(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9_.-]/g, "");
  if (!clean || clean === "." || clean === "..") {
    throw new Error(`Invalid path component: '${name}'`);
  }
  return clean;
}

// --- Tool response handler ---

export interface EpisodeOutput {
  draglines: string[];
  escalation: string | null;
  filesWritten: string[];
}

// --- Input schemas ---

const orientationSchema = type({ rationale: "string", content: "string" });
const understandingSchema = type({
  rationale: "string",
  domain: "string",
  filename: "string",
  content: "string",
});
const domainIndexSchema = type({ rationale: "string", content: "string" });
const draglineSchema = type({ thread: "string" });
const escalateSchema = type({ reason: "string" });
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
      case "update_orientation": {
        const { rationale, content } = parseOrThrow(orientationSchema(block.input));
        const path = join(BRAIN_DIR, "ORIENTATION.md");
        log(`Writing orientation (rationale: ${rationale})`);
        await writeFile(path, content + "\n");
        output.filesWritten.push("brain/ORIENTATION.md");
        return { result: "wrote brain/ORIENTATION.md", isError: false };
      }

      case "write_understanding": {
        const { rationale, domain, filename, content } = parseOrThrow(understandingSchema(block.input));
        const safeDomain = sanitize(domain);
        const safeFilename = sanitize(filename);
        const dir = join(UNDERSTANDING_DIR, safeDomain);
        await mkdir(dir, { recursive: true });
        const path = join(dir, safeFilename);
        log(`Writing understanding: ${safeDomain}/${safeFilename} (rationale: ${rationale})`);
        await writeFile(path, content + "\n");
        await updateSubIndex(dir, safeFilename, rationale);
        output.filesWritten.push(`brain/understanding/${safeDomain}/${safeFilename}`);
        return { result: `wrote brain/understanding/${safeDomain}/${safeFilename}`, isError: false };
      }

      case "update_domain_index": {
        const { rationale, content } = parseOrThrow(domainIndexSchema(block.input));
        const path = join(UNDERSTANDING_DIR, "INDEX.md");
        log(`Updating domain index (rationale: ${rationale})`);
        await writeFile(path, content + "\n");
        output.filesWritten.push("brain/understanding/INDEX.md");
        return { result: "wrote brain/understanding/INDEX.md", isError: false };
      }

      case "note_dragline": {
        const { thread } = parseOrThrow(draglineSchema(block.input));
        log(`Dragline: ${thread}`);
        output.draglines.push(thread);
        return { result: "logged", isError: false };
      }

      case "escalate": {
        const { reason } = parseOrThrow(escalateSchema(block.input));
        log(`ESCALATION: ${reason}`);
        output.escalation = reason;
        return { result: "escalation flagged", isError: false };
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
            output.filesWritten.push(`brain/tools/${safeName}.ts`);
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

        // Validate by importing — catches syntax errors and missing exports
        try {
          await importBrainTool(filePath);
        } catch (err) {
          await unlink(filePath);
          const msg = err instanceof Error ? err.message : String(err);
          return { result: `error: tool validation failed: ${msg}`, isError: true };
        }

        log(`Evolved: ${action}d tool ${safeName} (${rationale})`);
        output.filesWritten.push(`brain/tools/${safeName}.ts`);
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
