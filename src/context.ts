import { readFile } from "node:fs/promises";
import { join } from "node:path";

const BRAIN_DIR = join(import.meta.dirname, "..", "brain");
const PROMPTS_DIR = join(BRAIN_DIR, "prompts");
const UNDERSTANDING_DIR = join(BRAIN_DIR, "understanding");

async function readOrFallback(path: string, fallback: string): Promise<string> {
  try {
    return await readFile(path, "utf-8");
  } catch {
    return fallback;
  }
}

// --- Episode type parsing ---
// Format: "type" or "type-variant"
// Types from DESIGN.md: reactive, reflective, intentional, interactive
// Variants: genesis, light, deep, etc.
// Prompt resolution: variant prompt if it exists, else type prompt.

const VALID_TYPES = ["reactive", "reflective", "intentional", "interactive"] as const;
type BaseType = (typeof VALID_TYPES)[number];

export interface EpisodeType {
  base: BaseType;
  variant: string | null;
  raw: string;
}

export function parseEpisodeType(value: string): EpisodeType | null {
  const parts = value.split("-");
  const base = parts[0];
  if (!base || !VALID_TYPES.includes(base as BaseType)) return null;
  const variant = parts.length > 1 ? parts.slice(1).join("-") : null;
  return { base: base as BaseType, variant, raw: value };
}

// Prompt file resolution: try full name first, fall back to base type.
// "reflective-genesis" -> reflective-genesis.md, then reflective.md
// "reflective" -> reflective.md
function resolvePromptFile(ep: EpisodeType): string {
  return `${ep.raw}.md`;
}

function fallbackPromptFile(ep: EpisodeType): string {
  return `${ep.base}.md`;
}

export interface EpisodeContext {
  system: string;
  userMessage: string;
}

export async function assembleContext(
  episodeType: EpisodeType,
  observations: string,
): Promise<EpisodeContext> {
  const primary = resolvePromptFile(episodeType);
  const fallback = fallbackPromptFile(episodeType);

  const [identity, orientation, domainIndex] = await Promise.all([
    readOrFallback(join(BRAIN_DIR, "CLAUDE.md"), "(identity file not found)"),
    readOrFallback(join(BRAIN_DIR, "ORIENTATION.md"), "(no orientation yet)"),
    readOrFallback(join(UNDERSTANDING_DIR, "INDEX.md"), "(no domain index yet)"),
  ]);

  // Try variant prompt, fall back to base type prompt
  let episodePrompt = await readOrFallback(join(PROMPTS_DIR, primary), "");
  if (!episodePrompt && primary !== fallback) {
    episodePrompt = await readOrFallback(join(PROMPTS_DIR, fallback), "(prompt file not found)");
  }
  if (!episodePrompt) {
    episodePrompt = "(prompt file not found)";
  }

  const system = `${identity.trim()}\n\n---\n\n${episodePrompt.trim()}`;

  let userMessage = `## Current Orientation\n\n${orientation.trim()}\n\n## Domain Index\n\n${domainIndex.trim()}`;
  if (observations.trim()) {
    userMessage += `\n\n## Observations\n\n${observations}`;
  }

  return { system, userMessage };
}
