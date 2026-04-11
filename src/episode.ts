import Anthropic from "@anthropic-ai/sdk";
import { join } from "node:path";
import { $ } from "bun";
import { assembleContext } from "./context.ts";
import { generateObservations } from "./observations.ts";
import { tools as builtinTools, handleToolCall, type EpisodeOutput } from "./tools.ts";
import { loadBrainTools, handleBrainToolCall, type BrainTool } from "./brain-tools.ts";

const REPO_ROOT = join(import.meta.dirname, "..");
const BRAIN_DIR = join(REPO_ROOT, "brain");
const LOG_DIR = join(REPO_ROOT, "logs");
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 8192;

// --- Episode log ---
import { mkdirSync, appendFileSync } from "node:fs";
mkdirSync(LOG_DIR, { recursive: true });

const episodeStart = new Date();
const logFile = join(LOG_DIR, `${episodeStart.toISOString().replace(/:/g, "-")}.log`);

function log(msg: string): void {
  process.stderr.write(msg + "\n");
  appendFileSync(logFile, msg + "\n");
}

function fatal(msg: string): never {
  log(`FATAL: ${msg}`);
  process.exit(1);
}

// --- Set cwd to repo root ---
process.chdir(REPO_ROOT);

// --- Generate observations ---
log(`=== Episode ===`);
log(`Model: ${MODEL}`);

log("Generating observations...");
const observations = await generateObservations(log);

// --- Load brain-created tools ---
let brainTools: BrainTool[] = await loadBrainTools(log);
let allTools = [...builtinTools, ...brainTools.map((t) => t.definition)];
log(`Tools: ${builtinTools.length} built-in, ${brainTools.length} brain-created`);

// --- Assemble context ---
const { system, userMessage } = await assembleContext(observations);

// --- Call API ---
log("Calling API...");
const client = new Anthropic();

type Message = Anthropic.Messages.MessageParam;
const messages: Message[] = [{ role: "user", content: userMessage }];

let response: Anthropic.Messages.Message;
try {
  response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system,
    tools: allTools,
    messages,
  });
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  fatal(`API call failed: ${msg}`);
}

log(`Tokens: ${response.usage.input_tokens} in, ${response.usage.output_tokens} out`);
log(`Stop reason: ${response.stop_reason}`);

if (response.stop_reason === "max_tokens") {
  log("WARN: Response truncated (max_tokens). Episode may be incomplete.");
}

// --- Display reasoning ---
log("\n=== Brain's reasoning ===");
for (const block of response.content) {
  if (block.type === "text") {
    log(block.text);
  }
}

// --- Process tool calls (with continuation loop) ---
log("\n=== Processing tool calls ===");
const output: EpisodeOutput = {
  filesRead: [],
  filesWritten: [],
  draglinesLogged: 0,
  toolsEvolved: 0,
};
let brainToolsUsed = 0;

const MAX_TURNS = 40;
let turn = 0;

while (turn < MAX_TURNS) {
  // Only process tool calls when the model explicitly requested tool use
  if (response.stop_reason !== "tool_use") break;

  const toolBlocks = response.content.filter(
    (b): b is Anthropic.Messages.ToolUseBlock => b.type === "tool_use",
  );

  if (toolBlocks.length === 0) break;

  const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];
  for (const block of toolBlocks) {
    let callResult = await handleToolCall(block, output, log);
    if (!callResult) {
      const brainResult = await handleBrainToolCall(block, brainTools, log);
      if (brainResult) {
        callResult = brainResult;
        brainToolsUsed++;
      } else {
        log(`WARN: Unknown tool: ${block.name}`);
        callResult = { result: `error: unknown tool '${block.name}'`, isError: true };
      }
    }
    toolResults.push({
      type: "tool_result",
      tool_use_id: block.id,
      content: callResult.result,
      is_error: callResult.isError,
    });
  }

  // Reload brain tools — evolve may have created/updated/deleted tools
  brainTools = await loadBrainTools(log);
  allTools = [...builtinTools, ...brainTools.map((t) => t.definition)];

  messages.push({ role: "assistant", content: response.content });
  messages.push({ role: "user", content: toolResults });

  log(`\n--- Continuation turn ${turn + 1} ---`);
  try {
    response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      tools: allTools,
      messages,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    fatal(`API continuation call failed: ${msg}`);
  }

  log(`Tokens: ${response.usage.input_tokens} in, ${response.usage.output_tokens} out`);
  log(`Stop reason: ${response.stop_reason}`);

  for (const block of response.content) {
    if (block.type === "text") {
      log(block.text);
    }
  }

  if (response.stop_reason === "max_tokens") {
    log("WARN: Continuation truncated. Tool calls in this response will not be processed.");
    break;
  }

  turn++;
}

if (turn >= MAX_TURNS) {
  log("WARN: Hit max continuation turns. Episode may be incomplete.");
}

// --- Check the brain actually did something ---
const didSomething = output.filesRead.length > 0 || output.filesWritten.length > 0 || output.toolsEvolved > 0 || brainToolsUsed > 0 || output.draglinesLogged > 0;

if (!didSomething) {
  log("The brain reasoned but produced no tool calls at all.");
  fatal("Brain did nothing. No files read, no tools used.");
}

// --- Git commit and push to main ---
const status = await $`git status --porcelain -- brain/`.quiet().text();

if (!output.filesWritten.includes("brain/ORIENTATION.md")) {
  log("WARN: Brain did not update orientation.");
}
if (status.trim()) {
  const timestamp = new Date().toISOString();
  const commitMsg =
    `episode: ${timestamp}\n\n` +
    `Model: ${MODEL}\n` +
    `Tokens: ${response.usage.input_tokens} in, ${response.usage.output_tokens} out\n` +
    `Files written: ${output.filesWritten.join(", ")}\n` +
    `Files read: ${output.filesRead.join(", ")}`;

  try {
    await $`git add brain/`.quiet();
    await $`git commit -m ${commitMsg}`.quiet();
    await $`git push`.quiet();
    log(`\n=== Episode committed and pushed to main ===`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log(`WARN: Git operation failed: ${msg}`);
    log("Changes may be staged but not committed/pushed. Fix manually.");
  }
} else {
  log("\n=== No changes to commit ===");
}

log("\n=== Episode complete ===");
