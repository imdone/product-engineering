#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  path.join(root, "SKILL.md"),
  path.join(root, "references", "session-setup.md"),
  path.join(root, "references", "interaction-contract.md"),
  path.join(root, "references", "prove-the-outcome.md"),
];

function main() {
  const combined = files
    .filter((file) => fs.existsSync(file))
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n")
    .toLowerCase();
  const errors = [];

  if (!combined.includes("imdone note") || !combined.includes("try `imdone note")) {
    errors.push("HDD progress-note guidance must tell agents to try `imdone note` first.");
  }
  if (!combined.includes("append") || !combined.includes("only if `imdone note` is unavailable")) {
    errors.push("HDD progress-note guidance must allow direct Markdown appends only when `imdone note` is unavailable or fails.");
  }
  if (!combined.includes("attachments/progress-notes.md")) {
    errors.push("HDD progress lookup must name `attachments/progress-notes.md` as the canonical progress-note artifact.");
  }
  if (!combined.includes("legacy") || !combined.includes("fallback") || !combined.includes("attachments/plan.md")) {
    errors.push("HDD progress lookup must keep a legacy fallback to `attachments/plan.md` progress notes.");
  }

  if (errors.length > 0) {
    for (const error of errors) console.log(`ERROR: ${error}`);
    return 1;
  }

  console.log("OK: HDD progress-note guidance tries imdone note first, uses direct Markdown fallback only when needed, and keeps legacy plan fallback.");
  return 0;
}

process.exit(main());
