#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { evaluateStory, issueFiles, markdownReport } from "./evaluate_hdd_skill.mjs";

function parseArgs(argv) {
  const args = { root: ".", outdir: null };
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") args.root = argv[++index];
    else if (arg === "--outdir") args.outdir = argv[++index];
    else if (arg === "-h" || arg === "--help") args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  fs.chmodSync(dest, fs.statSync(src).mode);
}

function main(argv) {
  const args = parseArgs(argv);
  if (args.help || !args.outdir) {
    console.log("usage: bundle_hdd_feedback.mjs [--root DIR] --outdir DIR");
    return args.help ? 0 : 2;
  }

  const root = path.resolve(args.root);
  const outdir = path.resolve(args.outdir);
  fs.mkdirSync(outdir, { recursive: true });

  const files = issueFiles(root);
  const evaluations = files
    .map((issuePath) => evaluateStory(issuePath))
    .filter(Boolean)
    .sort((a, b) => a.key.localeCompare(b.key));

  fs.writeFileSync(path.join(outdir, "hdd-skill-report.md"), markdownReport(evaluations), "utf8");
  fs.writeFileSync(
    path.join(outdir, "hdd-skill-report.json"),
    JSON.stringify({ stories_evaluated: evaluations.length, stories: evaluations }, null, 2),
    "utf8",
  );

  const feedbackDir = path.join(outdir, "story-feedback");
  fs.mkdirSync(feedbackDir, { recursive: true });

  for (const issuePath of files) {
    const storyDir = path.dirname(issuePath);
    const storyKey = path.basename(issuePath, ".md").replace(/^issue-/, "");
    for (const name of ["hdd-skill-feedback.md", "hdd-skill-feedback.json"]) {
      const src = path.join(storyDir, "attachments", name);
      if (!fs.existsSync(src)) continue;
      copyFile(src, path.join(feedbackDir, storyKey, name));
    }
  }

  const zipPath = path.join(outdir, "hdd-skill-feedback-bundle.zip");
  if (fs.existsSync(zipPath)) fs.rmSync(zipPath);
  execFileSync("zip", ["-qr", zipPath, "."], { cwd: outdir });

  console.log(`Bundle created at: ${zipPath}`);
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.exit(main(process.argv));
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(2);
  }
}
