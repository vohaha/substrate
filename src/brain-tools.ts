import type Anthropic from "@anthropic-ai/sdk";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

export const BRAIN_TOOLS_DIR = join(import.meta.dirname, "..", "brain", "tools");

export interface BrainTool {
  name: string;
  definition: Anthropic.Messages.Tool;
  handler: (input: Record<string, unknown>) => Promise<string>;
}

export const RESERVED_NAMES = new Set([
  "write_file",
  "note_dragline",
  "evolve",
]);

export async function loadBrainTools(
  log: (msg: string) => void,
): Promise<BrainTool[]> {
  let files: string[];
  try {
    files = await readdir(BRAIN_TOOLS_DIR);
  } catch {
    return [];
  }

  const tools: BrainTool[] = [];
  const seen = new Set<string>();
  for (const file of files) {
    if (!file.endsWith(".ts")) continue;
    const filePath = join(BRAIN_TOOLS_DIR, file);
    try {
      const tool = await importBrainTool(filePath);
      if (RESERVED_NAMES.has(tool.name)) {
        log(`WARN: Brain tool '${tool.name}' collides with built-in, skipping`);
        continue;
      }
      if (seen.has(tool.name)) {
        log(`WARN: Duplicate brain tool name '${tool.name}' in ${file}, skipping`);
        continue;
      }
      seen.add(tool.name);
      tools.push(tool);
      log(`Loaded brain tool: ${tool.name}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`WARN: Failed to load brain tool ${file}: ${msg}`);
    }
  }

  return tools;
}

export async function importBrainTool(filePath: string): Promise<BrainTool> {
  const mod = await import(`${filePath}?t=${Date.now()}`);

  if (!mod.definition || typeof mod.definition !== "object") {
    throw new Error("Missing or invalid `definition` export");
  }
  if (typeof mod.handler !== "function") {
    throw new Error("Missing or invalid `handler` export");
  }

  const def = mod.definition as Anthropic.Messages.Tool;
  if (!def.name || !def.description || !def.input_schema) {
    throw new Error("definition must have name, description, and input_schema");
  }

  return {
    name: def.name,
    definition: def,
    handler: mod.handler,
  };
}

export async function handleBrainToolCall(
  block: Anthropic.Messages.ToolUseBlock,
  brainTools: BrainTool[],
  log: (msg: string) => void,
): Promise<{ result: string; isError: boolean } | null> {
  const tool = brainTools.find((t) => t.name === block.name);
  if (!tool) return null;

  try {
    log(`Brain tool: ${block.name}`);
    const result = await tool.handler(block.input as Record<string, unknown>);
    return { result, isError: false };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log(`ERROR in brain tool ${block.name}: ${msg}`);
    return { result: `error: ${msg}`, isError: true };
  }
}
