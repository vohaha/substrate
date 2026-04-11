import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { $ } from "bun";

// All commands are hardcoded — no user input is interpolated.
async function exec(cmd: string): Promise<string> {
  try {
    const result = await $`sh -c ${cmd}`.quiet().text();
    return result.trim();
  } catch {
    return "(unavailable)";
  }
}

const BRAIN_DIR = join(import.meta.dirname, "..", "brain");
const BODY_FILE = join(BRAIN_DIR, "body.md");

async function generateBodyReport(): Promise<string> {
  const sections: string[] = [];

  // Hardware
  sections.push("## Hardware");
  sections.push(await exec("uname -a"));
  if (process.platform === "darwin") {
    sections.push(await exec("sysctl -n machdep.cpu.brand_string"));
    sections.push(`Cores: ${await exec("sysctl -n hw.ncpu")}`);
    const memBytes = parseInt(await exec("sysctl -n hw.memsize"), 10);
    sections.push(`Memory: ${Math.round(memBytes / 1073741824)} GB`);
  } else {
    sections.push(await exec("lscpu 2>/dev/null | head -20"));
    sections.push(await exec("free -h 2>/dev/null | head -2"));
  }

  // OS
  sections.push("", "## OS");
  if (process.platform === "darwin") {
    sections.push(await exec("sw_vers 2>/dev/null || uname -sr"));
  } else {
    sections.push(await exec("cat /etc/os-release 2>/dev/null || uname -sr"));
  }

  // Network
  sections.push("", "## Network");
  sections.push(await exec("hostname"));

  // Installed tools
  sections.push("", "## Installed Tools");
  const cmds = ["git", "curl", "jq", "bun", "psql", "python3", "node"];
  const versions = await Promise.all(
    cmds.map((cmd) => exec(`${cmd} --version 2>&1 | head -1`)),
  );
  for (let i = 0; i < cmds.length; i++) {
    sections.push(`${cmds[i]}: ${versions[i]}`);
  }

  return sections.join("\n");
}

// Returns body diff section for observations, or empty string if unchanged.
async function updateBodyReport(log: (msg: string) => void): Promise<string> {
  const current = await generateBodyReport();

  let previous = "";
  try {
    previous = (await readFile(BODY_FILE, "utf-8")).trim();
  } catch {
    // First run — no previous file
  }

  await mkdir(dirname(BODY_FILE), { recursive: true });
  await writeFile(BODY_FILE, current + "\n");

  if (previous === "") {
    log("Body report: first generation");
    return "--- Body (first report) ---\n" + current;
  }

  if (previous === current) {
    log("Body report: unchanged");
    return "";
  }

  log("Body report: changed");
  return "--- Body (changed since last episode) ---\n" + current;
}

export async function generateObservations(log: (msg: string) => void): Promise<string> {
  // All commands hardcoded — no user input interpolated.
  const sections: string[] = ["=== Environment ===", ""];

  sections.push(`Timestamp: ${new Date().toISOString()}`);
  sections.push(`Host: ${await exec("hostname")}`);
  sections.push("");

  sections.push("--- Recent history ---");
  sections.push(await exec("git log --oneline -10"));
  sections.push("");

  sections.push("--- Brain directory ---");
  sections.push(await exec("find brain/ -not -path 'brain/archive/*' -type f | sort"));
  sections.push("");

  sections.push("--- Substrate root ---");
  sections.push(await exec("ls -la ."));
  sections.push("");

  sections.push("--- System ---");
  sections.push(await exec("uptime"));
  sections.push(`Disk: ${await exec("df -h / | tail -1")}`);

  // Body report — only included if new or changed
  const bodySection = await updateBodyReport(log);
  if (bodySection) {
    sections.push("", bodySection);
  }

  return sections.join("\n");
}
