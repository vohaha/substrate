import Anthropic from "@anthropic-ai/sdk";
import { appendFile, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { $ } from "bun";
import { assembleContext, parseEpisodeType } from "./context.ts";
import { generateBodyObservations } from "./observations.ts";
import { tools as builtinTools, handleToolCall, type EpisodeOutput } from "./tools.ts";
import { loadBrainTools, handleBrainToolCall, type BrainTool } from "./brain-tools.ts";

const REPO_ROOT = join(import.meta.dirname, "..");
const BRAIN_DIR = join(REPO_ROOT, "brain");
const LOG_DIR = join(REPO_ROOT, "logs");
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 8192;

// --- Episode log ---
// Every episode leaves a record. Success or failure. Stderr is for the
// human watching live; the log file is for the body reviewing what happened.
// Log file is opened immediately and appended on every write — if the process
// crashes, everything up to the crash is on disk.
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

// --- Parse args ---
const arg = process.argv[2];
const episodeType = arg ? parseEpisodeType(arg) : null;
if (!episodeType) {
  log("Usage: bun run src/episode.ts <type>[-variant]");
  log("Types: reactive, reflective, intentional, interactive");
  log("Variants: reflective-genesis, reflective-deep, reflective-light, ...");
  process.exit(1);
}

// --- Set cwd to repo root early (observations depend on it) ---
process.chdir(REPO_ROOT);

// --- Generate observations ---
log(`=== Episode: ${episodeType.raw} ===`);
log(`Model: ${MODEL}`);

let observations = "";
if (episodeType.base === "reflective" && episodeType.variant === "genesis") {
  log("Generating body observations...");
  observations = await generateBodyObservations();
}

// --- Load brain-created tools ---
let brainTools: BrainTool[] = await loadBrainTools(log);
let allTools = [...builtinTools, ...brainTools.map((t) => t.definition)];
log(`Tools: ${builtinTools.length} built-in, ${brainTools.length} brain-created`);

// --- Assemble context ---
const { system, userMessage } = await assembleContext(episodeType, observations);

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

let truncated = false;
if (response.stop_reason === "max_tokens") {
  log("WARN: Response truncated (max_tokens). Processing available tool calls, then validating.");
  truncated = true;
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
  draglines: [],
  escalation: null,
  filesWritten: [],
};
let brainToolsUsed = 0;

const MAX_TURNS = 20;
let turn = 0;

while (turn < MAX_TURNS) {
  const toolBlocks = response.content.filter(
    (b): b is Anthropic.Messages.ToolUseBlock => b.type === "tool_use",
  );

  if (toolBlocks.length === 0) break;

  // Process each tool call: try built-in first, then brain-created
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

  // If the model stopped for tool_use, continue the conversation
  if (response.stop_reason !== "tool_use") break;

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

  if (response.stop_reason === "max_tokens") {
    log("WARN: Continuation response truncated. Processing available tool calls.");
    truncated = true;
    // Don't continue the loop — process what we have and validate
    break;
  }

  // Display any reasoning in continuation
  for (const block of response.content) {
    if (block.type === "text") {
      log(block.text);
    }
  }

  turn++;
}

if (turn >= MAX_TURNS) {
  log("WARN: Hit max continuation turns. Episode may be incomplete.");
}

// --- Check the brain actually did something ---
const didSomething =
  output.filesWritten.length > 0 ||
  output.draglines.length > 0 ||
  output.escalation !== null ||
  brainToolsUsed > 0;

if (!didSomething) {
  log("The brain reasoned but produced no tool calls at all.");
  fatal("Brain did nothing. No files, no draglines, no escalation.");
}

// --- Save draglines ---
if (output.draglines.length > 0) {
  const draglineFile = join(BRAIN_DIR, "draglines.log");
  const timestamp = new Date().toISOString();
  const entry =
    `\n--- ${timestamp} (${episodeType.raw}) ---\n` +
    output.draglines.map((d) => `- ${d}`).join("\n") +
    "\n";
  await appendFile(draglineFile, entry);
  log(`  -> ${output.draglines.length} dragline(s) logged`);
}

// --- Save escalation ---
if (output.escalation) {
  await writeFile(join(BRAIN_DIR, ".escalation"), output.escalation + "\n");
  log("  -> Escalation flag written");
}

// --- Validate before commit ---
const orientationPath = join(BRAIN_DIR, "ORIENTATION.md");
let valid = true;

if (output.filesWritten.includes("brain/ORIENTATION.md")) {
  const orientation = await readFile(orientationPath, "utf-8");
  const tokenEstimate = Math.ceil(orientation.length / 4);
  if (tokenEstimate > 2000) {
    log(`WARN: Orientation is ~${tokenEstimate} tokens (limit 1500). Too long.`);
    valid = false;
  }
  const requiredSections = ["Active Intentions", "Open Edges", "Recent Shifts", "Register"];
  for (const section of requiredSections) {
    if (!orientation.includes(section)) {
      log(`WARN: Orientation missing section: ${section}`);
      valid = false;
    }
  }
}

if (!output.filesWritten.includes("brain/ORIENTATION.md")) {
  log("WARN: Brain did not update orientation. Episode may be incomplete.");
  if (truncated) {
    log("WARN: Response was truncated — orientation may have been cut off.");
    valid = false;
  }
}

if (!valid) {
  log("Run 'git diff brain/' to inspect, then commit or reset manually.");
  fatal("Validation failed. Changes left unstaged for manual review.");
}

// --- Git commit and push to main ---
const status = await $`git status --porcelain -- brain/`.quiet().text();
if (status.trim()) {
  const timestamp = new Date().toISOString();
  const commitMsg =
    `episode(${episodeType.raw}): ${timestamp}\n\n` +
    `Type: ${episodeType.raw}\n` +
    `Model: ${MODEL}\n` +
    `Tokens: ${response.usage.input_tokens} in, ${response.usage.output_tokens} out\n` +
    `Files: ${output.filesWritten.join(", ")}`;

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
