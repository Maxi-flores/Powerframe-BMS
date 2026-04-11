/**
 * POST /api/milestone
 * Accepts a BMS milestone push from the git hook / build script.
 *
 * Body (JSON):
 *   {
 *     type:     "build" | "test",          // milestone type
 *     message:  string,                    // human-readable label
 *     passRate: number (0-100, tests only),// test pass percentage
 *     branch:   string,                    // git branch name
 *     commit:   string,                    // short commit SHA
 *     secret:   string                     // matches BMS_HOOK_SECRET env var
 *   }
 *
 * On success: 200 { ok: true, milestone: { ... } }
 * On error:   400/401/500 { ok: false, error: "..." }
 */
export default function handler(req, res) {
  // Only accept POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // Optional shared secret validation
  const hookSecret = process.env.BMS_HOOK_SECRET;
  if (hookSecret) {
    const provided = req.headers["x-bms-secret"] || req.body?.secret;
    if (provided !== hookSecret) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
  }

  const { type, message, passRate, branch, commit } = req.body || {};

  // Validate required fields
  if (!type || !["build", "test"].includes(type)) {
    return res.status(400).json({
      ok: false,
      error: 'Field "type" must be "build" or "test"',
    });
  }

  if (!message) {
    return res.status(400).json({ ok: false, error: 'Field "message" is required' });
  }

  const milestone = {
    id: Date.now(),
    type,
    message,
    passRate: type === "test" ? (passRate ?? null) : undefined,
    branch: branch || null,
    commit: commit ? String(commit).slice(0, 8) : null,
    timestamp: new Date().toISOString(),
  };

  // The frontend's WorkStateContext reads milestones from localStorage.
  // This endpoint acts as the Powerstarter Hub receiver — in a real deployment
  // you would persist this to a database and broadcast via WebSocket/SSE.
  // For now we echo the milestone back so the CLI hook can confirm delivery.
  return res.status(200).json({ ok: true, milestone });
}
