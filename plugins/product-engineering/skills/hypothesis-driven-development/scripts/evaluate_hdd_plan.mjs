#!/usr/bin/env node
import fs from "node:fs";

const TASK_RE = /^\s*[-*]\s+\[(?<mark>[ xX])\]\s+(?<text>.+)$/;
const HEADING_RE = /^(?<level>#{2,6})\s+(?<title>.+)$/;
const RED_RE = /\bred\b|failing test|failing reproduction|executable proof|reproduction/i;
const GREEN_RE = /\bgreen\b|smallest change|make .* pass|turns? .* green/i;
const REFACTOR_RE = /\brefactor\b|cleanup|clean up|dependency-rule|dependency inversion|contract tightening/i;
const NON_EXEC_RE = /non-executable|external evidence|evidence gate|blocked|planning only/i;
const README_RE = /\bREADME\b|readme/i;
const CHANGELOG_RE = /\bCHANGELOG\b|changelog|release note/i;
const DOC_DECISION_RE = /update|no[- ]?change|not needed|not applicable|does not apply|skip/i;
const README_STYLE_RE = /readme-style-guide|README style guide|readme style guide/i;
const CHANGELOG_STYLE_RE = /changelog-style-guide|CHANGELOG style guide|changelog style guide/i;
const FULL_TEST_SUITE_RE = /\bfull (test suite|suite)\b|\bentire test suite\b|\bcomplete test suite\b|\ball tests\b|\bnpm test\b|\bnpm run test-ci\b|\bnpm run test\b|\bpnpm test\b|\byarn test\b|\bcargo test\b|\bgo test \.\/\.\.\.\b|\bpytest\b|\bvitest --run\b/i;

function classify(text) {
  const normalized = text.trim().toLowerCase();
  if (normalized.startsWith("red:") || normalized.startsWith("red -")) return "red";
  if (normalized.startsWith("green:") || normalized.startsWith("green -")) return "green";
  if (normalized.startsWith("refactor:") || normalized.startsWith("refactor -")) return "refactor";
  if (RED_RE.test(text)) return "red";
  if (REFACTOR_RE.test(text)) return "refactor";
  if (GREEN_RE.test(text)) return "green";
  return null;
}

function isExecutable(task) {
  return !(NON_EXEC_RE.test(task.text) || NON_EXEC_RE.test(task.section));
}

export function parseTasks(path) {
  let section = "Document";
  const tasks = [];
  const lines = fs.readFileSync(path, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    const heading = line.match(HEADING_RE);
    if (heading) {
      section = heading.groups.title.trim();
      return;
    }

    const task = line.match(TASK_RE);
    if (task) {
      tasks.push({
        line: index + 1,
        checked: task.groups.mark.toLowerCase() === "x",
        text: task.groups.text.trim(),
        section,
      });
    }
  });

  return tasks;
}

export function evaluate(path) {
  const tasks = parseTasks(path);
  const executable = tasks.filter(isExecutable);
  const findings = [];

  if (executable.length === 0) {
    return [{ message: "No executable markdown tasks found." }];
  }

  const first = executable[0];
  if (classify(first.text) !== "red") {
    findings.push({ message: `First executable task must be red. Line ${first.line}: ${first.text}` });
  }

  let seenUnchecked = null;
  for (const task of executable) {
    if (seenUnchecked && task.checked) {
      findings.push({
        message: `Checked task appears after unchecked executable task. Line ${seenUnchecked.line} must be checked before line ${task.line} can be done.`,
      });
    }
    if (!task.checked && seenUnchecked === null) {
      seenUnchecked = task;
    }
  }

  const lastExecutable = executable[executable.length - 1];
  if (!FULL_TEST_SUITE_RE.test(lastExecutable.text)) {
    findings.push({
      message: `Last executable task must run the full test suite as the final implementation confirmation. Line ${lastExecutable.line}: ${lastExecutable.text}`,
    });
  }

  const classes = executable.map((task) => [task, classify(task.text)]);
  const allTaskText = tasks.map((task) => task.text).join("\n");
  if (!(README_RE.test(allTaskText) && DOC_DECISION_RE.test(allTaskText))) {
    findings.push({ message: "Plan must include a README update task or an explicit no-change decision." });
  }
  if (!(CHANGELOG_RE.test(allTaskText) && DOC_DECISION_RE.test(allTaskText))) {
    findings.push({ message: "Plan must include a changelog update task or an explicit no-change decision." });
  }
  if (README_RE.test(allTaskText) && /README.*update|update.*README|readme.*update|update.*readme/i.test(allTaskText) && !README_STYLE_RE.test(allTaskText)) {
    findings.push({ message: "README update tasks must reference the README style guide." });
  }
  if (CHANGELOG_RE.test(allTaskText) && /CHANGELOG.*update|update.*CHANGELOG|changelog.*update|update.*changelog|release note/i.test(allTaskText) && !CHANGELOG_STYLE_RE.test(allTaskText)) {
    findings.push({ message: "Changelog update tasks must reference the changelog style guide." });
  }

  const present = new Set(classes.map(([, kind]) => kind).filter(Boolean));
  for (const required of ["red", "green", "refactor"]) {
    if (!present.has(required)) {
      findings.push({ message: `Missing explicit ${required} task.` });
    }
  }

  const firstIndex = {};
  for (const kind of present) {
    firstIndex[kind] = classes.findIndex(([, found]) => found === kind);
  }
  if (["red", "green", "refactor"].every((kind) => firstIndex[kind] !== undefined)) {
    if (!(firstIndex.red < firstIndex.green && firstIndex.green < firstIndex.refactor)) {
      findings.push({ message: "First red, green, and refactor tasks are not in red/green/refactor order." });
    }
  }

  const bySection = new Map();
  for (const [task, kind] of classes) {
    const lowerSection = task.section.toLowerCase();
    if (lowerSection.includes("phase") || lowerSection.includes("implement")) {
      if (!bySection.has(task.section)) bySection.set(task.section, []);
      bySection.get(task.section).push([task, kind]);
    }
  }

  for (const [section, sectionTasks] of bySection) {
    const kinds = sectionTasks.map(([, kind]) => kind).filter(Boolean);
    if (kinds.length === 0) continue;
    for (const required of ["red", "green", "refactor"]) {
      if (!kinds.includes(required)) {
        findings.push({ message: `Section '${section}' is missing an explicit ${required} task.` });
      }
    }
    if (["red", "green", "refactor"].every((required) => kinds.includes(required))) {
      if (!(kinds.indexOf("red") < kinds.indexOf("green") && kinds.indexOf("green") < kinds.indexOf("refactor"))) {
        findings.push({ message: `Section '${section}' is not in red/green/refactor order.` });
      }
    }
  }

  return findings;
}

function main(argv) {
  const plan = argv[2];
  if (!plan || argv.includes("-h") || argv.includes("--help")) {
    console.log("usage: evaluate_hdd_plan.mjs <plan>");
    return plan ? 0 : 2;
  }

  if (!fs.existsSync(plan)) {
    console.log(`ERROR: Plan not found: ${plan}`);
    return 2;
  }

  const findings = evaluate(plan);
  if (findings.length > 0) {
    for (const finding of findings) {
      console.log(`ERROR: ${finding.message}`);
    }
    return 1;
  }

  console.log("OK: plan follows red/green/refactor order and top-to-bottom task progress.");
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(main(process.argv));
}
