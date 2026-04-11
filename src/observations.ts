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

export async function generateBodyObservations(): Promise<string> {
  const sections: string[] = ["=== Body Self-Report ===", ""];

  // Hardware
  sections.push("--- Hardware ---");
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

  // Disk
  sections.push("", "--- Disk ---");
  sections.push(await exec("df -h / | tail -1"));

  // OS
  sections.push("", "--- OS ---");
  if (process.platform === "darwin") {
    sections.push(await exec("sw_vers 2>/dev/null || uname -sr"));
  } else {
    sections.push(await exec("cat /etc/os-release 2>/dev/null || uname -sr"));
  }

  // Network
  sections.push("", "--- Network ---");
  sections.push(await exec("hostname"));

  // Substrate directory
  sections.push("", "--- Substrate directory ---");
  sections.push(await exec("ls -la ."));

  // Brain directory
  sections.push("", "--- Brain directory ---");
  sections.push(await exec("ls -laR brain/"));

  // Git state
  sections.push("", "--- Git state ---");
  sections.push(await exec("git log --oneline -5"));

  // Installed tools
  sections.push("", "--- Installed tools ---");
  const cmds = ["git", "curl", "jq", "bun", "psql", "python3", "node"];
  const versions = await Promise.all(
    cmds.map((cmd) => exec(`${cmd} --version 2>&1 | head -1`)),
  );
  for (let i = 0; i < cmds.length; i++) {
    sections.push(`${cmds[i]}: ${versions[i]}`);
  }

  return sections.join("\n");
}

// Lightweight observations for every episode — external grounding
export async function generateEpisodeObservations(): Promise<string> {
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

  return sections.join("\n");
}
