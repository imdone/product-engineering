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

  if (!combined.includes("append") || !combined.includes("progress-notes.md")) {
    errors.push("HDD progress-note guidance must record notes directly in the local progress-note artifact.");
  }
  if (combined.includes("try `imdone note") || combined.includes("only if `imdone note`")) {
    errors.push("Public HDD progress-note guidance must not require imdone before writing local notes.");
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

  console.log("OK: public HDD writes progress notes directly and keeps the legacy plan fallback.");
  return 0;
}

process.exit(main());
