import { readFile } from "node:fs/promises";
import { join } from "node:path";

const BRAIN_DIR = join(import.meta.dirname, "..", "brain");
const PROMPTS_DIR = join(BRAIN_DIR, "prompts");

async function readOrFallback(path: string, fallback: string): Promise<string> {
  try {
    return await readFile(path, "utf-8");
  } catch {
    return fallback;
  }
}

export interface EpisodeContext {
  system: string;
  userMessage: string;
}

export async function assembleContext(observations: string): Promise<EpisodeContext> {
  const [identity, orientation, prompt] = await Promise.all([
    readOrFallback(join(BRAIN_DIR, "CLAUDE.md"), "(identity file not found)"),
    readOrFallback(join(BRAIN_DIR, "ORIENTATION.md"), "(no orientation yet)"),
    readOrFallback(join(PROMPTS_DIR, "episode.md"), "(no episode prompt)"),
  ]);

  const system = `${identity.trim()}\n\n---\n\n${prompt.trim()}`;

  let userMessage = `## Current Orientation\n\n${orientation.trim()}`;
  if (observations.trim()) {
    userMessage += `\n\n## Observations\n\n${observations}`;
  }

  return { system, userMessage };
}
