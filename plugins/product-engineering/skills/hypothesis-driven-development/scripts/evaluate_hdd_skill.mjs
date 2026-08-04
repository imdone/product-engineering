#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const PLACEHOLDER_PATTERNS = {
  "success-metrics.md": [
    "**What we're measuring**:",
    "**Baseline** (before):",
    "**Target** (after):",
    "**How to measure**:",
  ],
  "demo.md": ["**Environment**:", "**Test data**:", "1. **[Action]**", "2. **[Action]**", "3. **[Action]**"],
  "design.md": ["# SCRUM-", "Technical Design", "## Approach"],
  "plan.md": [
    "This file serves as the placeholder for plans, notes, and checklists related to the implementation of this story.",
  ],
};

const DIRECT_USER_FEEDBACK_TERMS = [
  "user feedback",
  "customer feedback",
  "in-app feedback",
  "feedback affordance",
  "real user",
  "prospect",
  "discovery conversation",
  "pilot conversation",
  "interview",
  "usability test",
  "customer call",
];

const INSTRUMENTATION_TERMS = [
  "instrumentation",
  "analytics",
  "telemetry",
  "event",
  "payload",
  "dashboard",
  "query",
  "observable data",
  "data capture",
];

const RISK_TERMS = ["value risk", "usability risk", "feasibility risk", "viability risk", "primary risk"];

function readText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, results);
    } else if (/^issue-.*\.md$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

export function issueFiles(root) {
  const results = [];
  for (const base of [path.join(root, "current-sprint"), path.join(root, ".archive")]) {
    results.push(...walk(base));
  }
  return results.sort();
}

function isHddStory(issueText) {
  return issueText.includes("#HDD-template");
}

function parseStatus(issueText) {
  return issueText.match(/^#\s+#([A-Z]+)\b/m)?.[1] ?? "UNKNOWN";
}

function parseKey(issuePath, issueText) {
  return (
    issueText.match(/jira:([A-Z]+-\d+)/)?.[1] ??
    issueText.match(/github:([^\s]+)/)?.[1] ??
    path.basename(issuePath).match(/issue-([A-Z]+-\d+)\.md$/)?.[1] ??
    path.parse(issuePath).name
  );
}

function sectionText(issueText, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return issueText.match(new RegExp(`(^#+\\s+${escaped}\\s*$[\\s\\S]*?)(?=^#+\\s+|\\s*$)`, "m"))?.[1] ?? "";
}

function nonPlaceholderAttachment(storyDir, name) {
  const text = readText(path.join(storyDir, "attachments", name)).trim();
  if (!text) return false;
  for (const pattern of PLACEHOLDER_PATTERNS[name] ?? []) {
    if (!text.includes(pattern)) return true;
  }
  return !(name in PLACEHOLDER_PATTERNS);
}

function parseFeedbackJson(storyDir) {
  const feedbackPath = path.join(storyDir, "attachments", "hdd-skill-feedback.json");
  if (!fs.existsSync(feedbackPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(feedbackPath, "utf8"));
  } catch {
    return null;
  }
}

function boolFromFeedback(feedback, key) {
  if (!feedback) return null;
  const value = feedback.signals?.[key];
  return typeof value === "boolean" ? value : null;
}

function includesAny(text, terms) {
  const lowered = text.toLowerCase();
  return terms.some((term) => lowered.includes(term));
}

function heuristicExternalGate(combinedText) {
  return includesAny(combinedText, [
    "external evidence",
    "real-world action",
    "blocked until",
    "calendar evidence",
    "customer action",
    "discovery conversation",
    "pilot conversation",
    "waiting on",
  ]);
}

export function evaluateStory(issuePath) {
  const issueText = readText(issuePath);
  if (!isHddStory(issueText)) return null;

  const storyDir = path.dirname(issuePath);
  const key = parseKey(issuePath, issueText);
  const status = parseStatus(issueText);
  const successMetrics = readText(path.join(storyDir, "attachments", "success-metrics.md"));
  const dod = readText(path.join(storyDir, "attachments", "dod.md"));
  const plan = readText(path.join(storyDir, "attachments", "plan.md"));
  const combined = [issueText, successMetrics, dod, plan].join("\n");
  const feedback = parseFeedbackJson(storyDir);

  const feedbackArtifactPresent =
    feedback !== null || fs.existsSync(path.join(storyDir, "attachments", "hdd-skill-feedback.md"));

  let explicitUserValuedOutcome = boolFromFeedback(feedback, "explicit_user_valued_outcome");
  if (explicitUserValuedOutcome === null) {
    const verticalText = sectionText(issueText, "Define the Outcome");
    explicitUserValuedOutcome =
      issueText.includes("Acceptance Criteria") &&
      ["user", "customer", "prospect", "reader", "team"].some((term) => verticalText.toLowerCase().includes(term));
  }

  let explicitPrimaryRisk = boolFromFeedback(feedback, "explicit_primary_risk");
  if (explicitPrimaryRisk === null) explicitPrimaryRisk = includesAny(combined, RISK_TERMS);

  let thinSlice = boolFromFeedback(feedback, "thin_slice");
  if (thinSlice === null) {
    const lowered = combined.toLowerCase();
    thinSlice = lowered.includes("3 days") || lowered.includes("appetite") || lowered.includes("smallest");
  }

  let measurableEvidence = boolFromFeedback(feedback, "measurable_evidence");
  if (measurableEvidence === null) measurableEvidence = nonPlaceholderAttachment(storyDir, "success-metrics.md");

  let instrumentationPath = boolFromFeedback(feedback, "instrumentation_path");
  if (instrumentationPath === null) instrumentationPath = includesAny(combined, INSTRUMENTATION_TERMS);

  let directUserFeedbackPath = boolFromFeedback(feedback, "direct_user_feedback_path");
  if (directUserFeedbackPath === null) directUserFeedbackPath = includesAny(combined, DIRECT_USER_FEEDBACK_TERMS);

  let externalEvidenceGateReached = boolFromFeedback(feedback, "external_evidence_gate_reached");
  if (externalEvidenceGateReached === null) externalEvidenceGateReached = heuristicExternalGate(combined);

  let handoffRiskReduced = boolFromFeedback(feedback, "handoff_risk_reduced");
  if (handoffRiskReduced === null) {
    handoffRiskReduced = includesAny(combined, [
      "handoff risk",
      "shared context",
      "safe to hand off",
      "handoff-ready",
      "missing context",
    ]);
  }

  const score = [
    explicitUserValuedOutcome,
    explicitPrimaryRisk,
    thinSlice,
    measurableEvidence,
    instrumentationPath,
    directUserFeedbackPath,
    handoffRiskReduced,
  ].filter(Boolean).length;

  return {
    key,
    path: issuePath,
    status,
    explicit_user_valued_outcome: explicitUserValuedOutcome,
    explicit_primary_risk: explicitPrimaryRisk,
    thin_slice: thinSlice,
    measurable_evidence: measurableEvidence,
    instrumentation_path: instrumentationPath,
    direct_user_feedback_path: directUserFeedbackPath,
    external_evidence_gate_reached: externalEvidenceGateReached,
    handoff_risk_reduced: handoffRiskReduced,
    feedback_artifact_present: feedbackArtifactPresent,
    score,
    friction: Array.isArray(feedback?.friction) ? feedback.friction.map(String) : [],
    author_signals: Array.isArray(feedback?.author_signals) ? feedback.author_signals.map(String) : [],
    suggested_improvement: feedback?.suggested_improvement ? String(feedback.suggested_improvement) : null,
  };
}

function yesno(value) {
  return value ? "yes" : "no";
}

export function markdownReport(evaluations) {
  const total = evaluations.length;
  if (total === 0) return "# HDD Skill Evaluation\n\nNo HDD stories found.\n";

  const count = (attr) => evaluations.filter((item) => item[attr]).length;
  const lines = [
    "# HDD Skill Evaluation",
    "",
    "## Summary",
    "",
    `- Stories evaluated: ${total}`,
    `- Explicit user-valued outcome: ${count("explicit_user_valued_outcome")}/${total}`,
    `- Explicit primary risk: ${count("explicit_primary_risk")}/${total}`,
    `- Thin slice signal: ${count("thin_slice")}/${total}`,
    `- Measurable evidence signal: ${count("measurable_evidence")}/${total}`,
    `- Instrumentation/data capture signal: ${count("instrumentation_path")}/${total}`,
    `- Direct user-feedback path signal: ${count("direct_user_feedback_path")}/${total}`,
    `- Handoff-risk reduction signal: ${count("handoff_risk_reduced")}/${total}`,
    `- External-evidence gate reached: ${count("external_evidence_gate_reached")}/${total}`,
    `- Explicit HDD feedback artifact present: ${count("feedback_artifact_present")}/${total}`,
    "",
    "## Story Scores",
    "",
    "| Story | Status | Score | Outcome | Risk | Slice | Evidence | Instrumentation | User Feedback | Handoff Risk | Feedback Artifact |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const item of evaluations) {
    lines.push(
      `| ${item.key} | ${item.status} | ${item.score}/7 | ` +
        `${yesno(item.explicit_user_valued_outcome)} | ${yesno(item.explicit_primary_risk)} | ` +
        `${yesno(item.thin_slice)} | ${yesno(item.measurable_evidence)} | ` +
        `${yesno(item.instrumentation_path)} | ` +
        `${yesno(item.direct_user_feedback_path)} | ${yesno(item.handoff_risk_reduced)} | ${yesno(item.feedback_artifact_present)} |`,
    );
  }

  const topGaps = [];
  if (count("instrumentation_path") < total) {
    topGaps.push("Some stories define success metrics without a clear instrumentation or durable data-capture path.");
  }
  if (count("direct_user_feedback_path") < total) {
    topGaps.push("Direct user-feedback paths are the weakest signal across the evaluated stories.");
  }
  if (count("feedback_artifact_present") < total) {
    topGaps.push("Most stories do not yet write explicit HDD feedback artifacts, so the evaluator falls back to heuristics.");
  }
  if (count("explicit_primary_risk") < total) {
    topGaps.push("Some stories still fail to name the primary product risk explicitly.");
  }
  if (count("handoff_risk_reduced") < total) {
    topGaps.push("Some stories still fail to make handoff-risk reduction explicit even when shared context is part of the real value.");
  }

  lines.push("", "## Top Gaps", "");
  if (topGaps.length > 0) {
    for (const gap of topGaps) lines.push(`- ${gap}`);
  } else {
    lines.push("- No obvious cross-story gap detected from the current signals.");
  }

  const improvements = evaluations.filter((item) => item.suggested_improvement);
  if (improvements.length > 0) {
    lines.push("", "## Suggested Improvements From Story Feedback", "");
    for (const item of improvements) lines.push(`- \`${item.key}\`: ${item.suggested_improvement}`);
  }

  const frictions = evaluations.flatMap((item) => item.friction.map((friction) => [item.key, friction]));
  if (frictions.length > 0) {
    lines.push("", "## Friction Notes", "");
    for (const [key, friction] of frictions) lines.push(`- \`${key}\`: ${friction}`);
  }

  const authorSignals = evaluations.flatMap((item) => item.author_signals.map((signal) => [item.key, signal]));
  if (authorSignals.length > 0) {
    lines.push("", "## Author Signals", "");
    for (const [key, signal] of authorSignals) lines.push(`- \`${key}\`: ${signal}`);
  }

  return `${lines.join("\n")}\n`;
}

function parseArgs(argv) {
  const args = { root: ".", writeReport: null, jsonOut: null };
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") args.root = argv[++index];
    else if (arg === "--write-report") args.writeReport = argv[++index];
    else if (arg === "--json-out") args.jsonOut = argv[++index];
    else if (arg === "-h" || arg === "--help") args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function main(argv) {
  const args = parseArgs(argv);
  if (args.help) {
    console.log("usage: evaluate_hdd_skill.mjs [--root DIR] [--write-report PATH] [--json-out PATH]");
    return 0;
  }

  const root = path.resolve(args.root);
  const evaluations = issueFiles(root)
    .map((issuePath) => evaluateStory(issuePath))
    .filter(Boolean)
    .sort((a, b) => a.key.localeCompare(b.key));

  const report = markdownReport(evaluations);
  process.stdout.write(report);

  if (args.writeReport) fs.writeFileSync(args.writeReport, report, "utf8");
  if (args.jsonOut) {
    fs.writeFileSync(
      args.jsonOut,
      JSON.stringify({ stories_evaluated: evaluations.length, stories: evaluations }, null, 2),
      "utf8",
    );
  }

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
