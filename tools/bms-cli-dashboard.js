#!/usr/bin/env node
/**
 * bms-cli-dashboard.js
 * ─────────────────────
 * Powerframe BMS — Live Terminal Health Dashboard
 *
 * Shows your BMS Health Score, WorkState, phase progress, and latest
 * milestones in a compact terminal UI while you write code.
 *
 * USAGE
 * ──────
 *   node tools/bms-cli-dashboard.js           # poll every 5 s
 *   node tools/bms-cli-dashboard.js --once    # single snapshot, then exit
 *   node tools/bms-cli-dashboard.js --watch   # live watch (default)
 *   node tools/bms-cli-dashboard.js --interval 10   # custom poll (seconds)
 *
 * The dashboard reads .bms-milestones.json (written by bms-milestone-hook.js)
 * as a local file-system bridge to the BMS WorkState.
 *
 * TIP: Add to your shell profile to start it in a tmux/split pane:
 *   alias bmswatch="node /path/to/tools/bms-cli-dashboard.js"
 */

import { existsSync, readFileSync, watchFile, unwatchFile } from "fs";
import { resolve, join } from "path";
import { parseArgs } from "util";

// ── Config ────────────────────────────────────────────────────────────────────
const LOCAL_STORE = resolve(join(process.cwd(), ".bms-milestones.json"));
const PHASES = [
  { id: 1, title: "Environment Bootstrap",  metric: "stability",    threshold: 80  },
  { id: 2, title: "Core Feature Build",     metric: "buildSuccess", threshold: 100 },
  { id: 3, title: "Test Suite Green",       metric: "testPass",     threshold: 95  },
  { id: 4, title: "Code Review Approved",   metric: "stability",    threshold: 100 },
  { id: 5, title: "Deployment Certified",   metric: "healthScore",  threshold: 90  },
];

const WORK_STATES = {
  Bootstrapping:    { label: "Bootstrapping",    icon: "🚀", color: "\x1b[33m" },
  Testing:          { label: "Testing",          icon: "🧪", color: "\x1b[34m" },
  Reviewing:        { label: "Reviewing",        icon: "🔍", color: "\x1b[35m" },
  Deployment_Ready: { label: "Deployment Ready", icon: "✅", color: "\x1b[32m" },
};

// ── Args ──────────────────────────────────────────────────────────────────────
const { values: args } = parseArgs({
  options: {
    once:     { type: "boolean" },
    watch:    { type: "boolean" },
    interval: { type: "string", short: "i" },
  },
  strict: false,
});

const POLL_MS = Math.max(2, Number(args.interval || 5)) * 1000;
const runOnce = args.once === true;

// ── Helpers ───────────────────────────────────────────────────────────────────
const c = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  blue:   "\x1b[34m",
  cyan:   "\x1b[36m",
  white:  "\x1b[97m",
};

function colored(text, ...codes) {
  return codes.join("") + text + c.reset;
}

function bar(value, width = 20, fillChar = "█", emptyChar = "░") {
  const filled = Math.round((Math.min(100, Math.max(0, value)) / 100) * width);
  return fillChar.repeat(filled) + emptyChar.repeat(width - filled);
}

function scoreColor(score) {
  if (score >= 90) return c.green;
  if (score >= 60) return c.yellow;
  return c.red;
}

function loadData() {
  if (!existsSync(LOCAL_STORE)) return null;
  try {
    const raw = JSON.parse(readFileSync(LOCAL_STORE, "utf8"));
    return raw.bms_workstate || null;
  } catch {
    return null;
  }
}

function computeHealthScore(metrics, completedPhases) {
  const stability    = metrics?.stability    ?? 0;
  const buildSuccess = metrics?.buildSuccess ?? 0;
  const testPass     = metrics?.testPass     ?? 0;
  const phaseScore   = ((completedPhases?.length || 0) / PHASES.length) * 40;
  const metricScore  = ((stability + buildSuccess + testPass) / 3) * 0.6;
  return Math.min(100, Math.round(phaseScore + metricScore));
}

function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[H");
}

function drawDashboard() {
  const data = loadData();

  const metrics        = data?.metrics || {};
  const completedPhases = data?.completedPhases || [];
  const milestones     = data?.milestones || [];
  const currentState   = data?.currentState || "Bootstrapping";
  const certifiedAt    = data?.certifiedAt || null;
  const healthScore    = computeHealthScore(metrics, completedPhases);
  const stateInfo      = WORK_STATES[currentState] || WORK_STATES.Bootstrapping;

  const width = Math.min(process.stdout.columns || 80, 80);
  const divider = colored("─".repeat(width), c.dim);

  clearScreen();

  // Header
  console.log("");
  console.log(colored(" ⚡ PowerFrame BMS — Live Health Dashboard", c.bold, c.white));
  console.log(divider);

  // WorkState + Health Score row
  const hs = String(healthScore).padStart(3);
  const hsBar = bar(healthScore, 24);
  const hsColor = scoreColor(healthScore);

  console.log(
    ` WorkState : ${stateInfo.color}${c.bold}${stateInfo.icon}  ${stateInfo.label}${c.reset}` +
    (certifiedAt ? colored("  ✅ Certified", c.green) : "")
  );
  console.log(
    ` Health    : ${colored(hs, hsColor, c.bold)}%  ${colored(hsBar, hsColor)}`
  );
  console.log("");

  // Metrics
  console.log(colored(" Live Metrics", c.bold, c.cyan));
  console.log(divider);

  const metricRows = [
    { key: "stability",    label: "Stability   ", color: "\x1b[35m" },
    { key: "buildSuccess", label: "Build       ", color: c.blue     },
    { key: "testPass",     label: "Tests       ", color: "\x1b[35m" },
  ];

  for (const { key, label, color } of metricRows) {
    const val = metrics[key] ?? 0;
    const valStr = String(val).padStart(3);
    const barStr = bar(val, 20);
    console.log(` ${label}: ${colored(valStr, color, c.bold)}%  ${colored(barStr, color)}`);
  }

  if (metrics.lastUpdated) {
    console.log(colored(`\n Last sync : ${new Date(metrics.lastUpdated).toLocaleTimeString()}`, c.dim));
  }

  // Phases
  console.log("");
  console.log(colored(" Phase Milestones", c.bold, c.cyan));
  console.log(divider);

  for (const phase of PHASES) {
    const done   = completedPhases.includes(phase.id);
    const mVal   = phase.metric === "healthScore" ? healthScore : (metrics[phase.metric] ?? 0);
    const canDo  = mVal >= phase.threshold;
    const tick   = done  ? colored("✓", c.green, c.bold)  :
                   canDo ? colored("○", c.yellow)           :
                           colored("·", c.dim);
    const label  = done  ? colored(phase.title, c.dim)     :
                   canDo ? colored(phase.title, c.white)    :
                           colored(phase.title, c.dim);
    const metric = done ? "" : colored(` [${phase.metric}: ${mVal}/${phase.threshold}]`, c.dim);
    console.log(` ${tick} ${phase.id}. ${label}${metric}`);
  }

  // Last milestones
  if (milestones.length > 0) {
    console.log("");
    console.log(colored(" Recent Milestones", c.bold, c.cyan));
    console.log(divider);

    const recent = milestones.slice(0, 5);
    for (const m of recent) {
      const typeTag = m.type === "test"
        ? colored(" TEST  ", "\x1b[35m", c.bold)
        : colored(" BUILD ", c.blue, c.bold);
      const rate    = m.passRate != null ? colored(` ${m.passRate}%`, c.green) : "";
      const time    = colored(new Date(m.timestamp).toLocaleTimeString(), c.dim);
      const sha     = m.commit ? colored(` @${m.commit}`, c.dim) : "";
      console.log(` [${typeTag}]  ${m.message}${rate}${sha}  ${time}`);
    }
  }

  // Footer
  console.log("");
  console.log(divider);
  const pollInfo = runOnce ? "" : `  Refreshing every ${POLL_MS / 1000}s — `;
  console.log(colored(`${pollInfo}  Ctrl+C to exit`, c.dim));

  if (!existsSync(LOCAL_STORE)) {
    console.log(colored("\n ⚠  No .bms-milestones.json found. Run the hook to populate data.", c.yellow));
  }
}

// ── Entrypoint ────────────────────────────────────────────────────────────────
drawDashboard();

if (runOnce) {
  process.exit(0);
}

// Poll on interval AND watch file changes
const interval = setInterval(drawDashboard, POLL_MS);

if (existsSync(LOCAL_STORE)) {
  watchFile(LOCAL_STORE, { interval: 1000 }, drawDashboard);
}

process.on("SIGINT", () => {
  clearInterval(interval);
  try { unwatchFile(LOCAL_STORE); } catch { /* ignore */ }
  process.stdout.write("\x1b[0m\n");
  process.exit(0);
});
