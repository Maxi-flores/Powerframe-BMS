#!/usr/bin/env node
/**
 * bms-milestone-hook.js
 * ─────────────────────
 * Powerframe BMS — Milestone Push Hook
 *
 * Drop this script into your project and call it after a successful build
 * or test run to push a "BMS Milestone" to the Powerstarter Hub.
 *
 * USAGE
 * ──────
 *   # After a successful build:
 *   node tools/bms-milestone-hook.js --type build --message "Vite build passed"
 *
 *   # After tests:
 *   node tools/bms-milestone-hook.js --type test --message "Vitest suite green" --pass-rate 98
 *
 * GIT HOOK INTEGRATION
 * ─────────────────────
 * Add to .git/hooks/post-commit (chmod +x):
 *
 *   #!/bin/sh
 *   npm run build 2>&1 && node tools/bms-milestone-hook.js --type build \
 *     --message "Build passed on commit $(git rev-parse --short HEAD)"
 *
 * POWERSHELL EQUIVALENT
 * ──────────────────────
 *   # In your build script or profile:
 *   npm run build
 *   if ($LASTEXITCODE -eq 0) {
 *     node tools/bms-milestone-hook.js --type build --message "Build OK"
 *   }
 *
 * ENVIRONMENT VARIABLES
 * ──────────────────────
 *   BMS_HUB_URL    Base URL of the Powerstarter Hub (default: http://localhost:5173)
 *   BMS_HOOK_SECRET  Shared secret for authenticated endpoints (optional)
 */

import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve, join } from "path";
import { parseArgs } from "util";

// ── Config ────────────────────────────────────────────────────────────────────
const HUB_URL = process.env.BMS_HUB_URL || "http://localhost:5173";
const API_ENDPOINT = `${HUB_URL}/api/milestone`;
const HOOK_SECRET = process.env.BMS_HOOK_SECRET || "";
const LOCAL_STORE = resolve(join(process.cwd(), ".bms-milestones.json"));
const HTTP_TIMEOUT_MS = 5000;

// ── Argument parsing ──────────────────────────────────────────────────────────
const { values: args } = parseArgs({
  options: {
    type:       { type: "string", short: "t" },   // "build" | "test"
    message:    { type: "string", short: "m" },
    "pass-rate":{ type: "string", short: "p" },   // 0-100 for test milestones
    branch:     { type: "string", short: "b" },
    commit:     { type: "string", short: "c" },
    dry:        { type: "boolean", short: "d" },  // dry-run: only write to local store
  },
  strict: false,
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function getGitInfo() {
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", { stdio: ["pipe", "pipe", "ignore"] })
      .toString().trim();
    const commit = execSync("git rev-parse --short HEAD", { stdio: ["pipe", "pipe", "ignore"] })
      .toString().trim();
    return { branch, commit };
  } catch (err) {
    console.warn(yellow("⚠  Could not read git info: " + err.message + " — using 'unknown'"));
    return { branch: "unknown", commit: "unknown" };
  }
}

function loadLocalStore() {
  if (existsSync(LOCAL_STORE)) {
    try { return JSON.parse(readFileSync(LOCAL_STORE, "utf8")); } catch { /* ignore */ }
  }
  return { milestones: [] };
}

function saveLocalStore(store) {
  writeFileSync(LOCAL_STORE, JSON.stringify(store, null, 2));
}

function timestamp() {
  return new Date().toISOString();
}

function colorize(text, code) {
  return `\x1b[${code}m${text}\x1b[0m`;
}

const green  = (t) => colorize(t, "32");
const yellow = (t) => colorize(t, "33");
const red    = (t) => colorize(t, "31");
const bold   = (t) => colorize(t, "1");
const dim    = (t) => colorize(t, "2");

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const type = args.type;
  const message = args.message;
  const passRate = args["pass-rate"] != null ? Number(args["pass-rate"]) : undefined;
  const isDry = args.dry === true;

  // Validate
  if (!type || !["build", "test"].includes(type)) {
    console.error(red("Error: --type must be 'build' or 'test'"));
    process.exit(1);
  }
  if (!message) {
    console.error(red("Error: --message is required"));
    process.exit(1);
  }

  // Git metadata
  const git = getGitInfo();
  const branch = args.branch || git.branch;
  const commit = args.commit || git.commit;

  const milestone = {
    id: Date.now(),
    type,
    message,
    passRate: type === "test" ? (passRate ?? 100) : undefined,
    branch,
    commit,
    timestamp: timestamp(),
  };

  console.log("");
  console.log(bold("🔌 BMS Milestone Hook"));
  console.log(dim("─────────────────────────────────────────"));
  console.log(`  Type    : ${type === "build" ? yellow("build 🔨") : yellow("test 🧪")}`);
  console.log(`  Message : ${message}`);
  if (type === "test") console.log(`  Pass %  : ${milestone.passRate}`);
  console.log(`  Branch  : ${branch}`);
  console.log(`  Commit  : ${commit}`);
  console.log(dim("─────────────────────────────────────────"));

  // Always write to local store (localStorage bridge)
  const store = loadLocalStore();
  store.milestones = [milestone, ...(store.milestones || [])].slice(0, 50);

  // Also update bms_workstate in localStorage-compatible JSON for browser sync
  const wsKey = "bms_workstate";
  if (!store[wsKey]) store[wsKey] = {};
  const metrics = store[wsKey].metrics || {};
  if (type === "build") metrics.buildSuccess = 100;
  if (type === "test")  metrics.testPass = milestone.passRate ?? 100;
  metrics.lastUpdated = timestamp();
  store[wsKey].metrics = metrics;
  store[wsKey].milestones = store.milestones;

  saveLocalStore(store);
  console.log(green("✓") + " Milestone written to " + LOCAL_STORE);

  // POST to hub (skip in dry-run mode)
  if (isDry) {
    console.log(yellow("⚠  Dry-run — skipping HTTP push"));
    console.log("");
    return;
  }

  try {
    const headers = { "Content-Type": "application/json" };
    if (HOOK_SECRET) headers["x-bms-secret"] = HOOK_SECRET;

    const body = JSON.stringify({
      type,
      message,
      passRate: milestone.passRate,
      branch,
      commit,
      secret: HOOK_SECRET || undefined,
    });

    // Use fetch (Node 18+) or fall back to dynamic import of node-fetch
    let fetchFn;
    try {
      fetchFn = globalThis.fetch || (await import("node-fetch")).default;
    } catch {
      fetchFn = null;
    }

    if (!fetchFn) {
      console.log(yellow("⚠  fetch not available — hub push skipped (local store updated)"));
      console.log("");
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);

    const res = await fetchFn(API_ENDPOINT, {
      method: "POST",
      headers,
      body,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (res.ok) {
      const data = await res.json();
      console.log(green("✓") + " Milestone pushed to Powerstarter Hub");
      console.log(dim("  " + JSON.stringify(data.milestone)));
    } else {
      const text = await res.text();
      console.log(yellow("⚠  Hub responded with " + res.status + ": " + text));
    }
  } catch (err) {
    if (err.name === "AbortError") {
      console.log(yellow("⚠  Hub push timed out (5 s) — local store updated"));
    } else {
      console.log(yellow("⚠  Hub not reachable: " + err.message));
      console.log(dim("   Local store was updated. Run the dashboard to sync."));
    }
  }

  console.log("");
}

main().catch((err) => {
  console.error(red("Fatal: " + err.message));
  process.exit(1);
});
