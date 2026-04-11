import React, { useState } from "react";
import { useWorkState } from "../context/WorkStateContext.jsx";
import { useProjects } from "../context/ProjectContext.jsx";

export default function WorkState() {
  const { activeProject } = useProjects();
  const {
    workState,
    workStateConfig,
    completedPhases,
    milestones,
    metrics,
    healthScore,
    certifiedAt,
    setWorkState,
    completePhase,
    uncompletePhase,
    updateMetrics,
    certify,
    phases,
    workStates,
  } = useWorkState();

  const [toast, setToast] = useState(null);
  const [editingMetrics, setEditingMetrics] = useState(false);
  const [metricDraft, setMetricDraft] = useState({
    stability: metrics.stability,
    buildSuccess: metrics.buildSuccess,
    testPass: metrics.testPass,
  });

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  function handleCompletePhase(phaseId) {
    const result = completePhase(phaseId);
    if (result.success) {
      showToast(`Phase ${phaseId} marked complete ✅`);
    } else {
      showToast(result.reason, false);
    }
  }

  function handleCertify() {
    const result = certify();
    if (result.success) {
      showToast("🎉 Project certified as Deployment Ready!");
    } else {
      showToast(result.reason, false);
    }
  }

  function saveMetrics() {
    updateMetrics({
      stability: Number(metricDraft.stability),
      buildSuccess: Number(metricDraft.buildSuccess),
      testPass: Number(metricDraft.testPass),
    });
    setEditingMetrics(false);
    showToast("Metrics updated");
  }

  const scoreColor =
    healthScore >= 90 ? "#22c55e" : healthScore >= 60 ? "#f59e0b" : "#ef4444";

  const circumference = 2 * Math.PI * 44;
  const dash = (healthScore / 100) * circumference;

  return (
    <div className="ws-container">
      <style>{css}</style>

      {toast && (
        <div className={`ws-toast ${toast.ok ? "ok" : "err"}`}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className="ws-header">
        <div>
          <h1>Workflow Orchestrator</h1>
          <p className="ws-subtitle">
            <span
              className="ws-badge"
              style={{ background: workStateConfig.color + "22", color: workStateConfig.color, borderColor: workStateConfig.color + "55" }}
            >
              {workStateConfig.icon} {workStateConfig.label}
            </span>
            &nbsp;·&nbsp;{activeProject?.name}
            {certifiedAt && (
              <span className="ws-certified">
                ✅ Certified {new Date(certifiedAt).toLocaleDateString()}
              </span>
            )}
          </p>
        </div>

        {/* Health Score Ring */}
        <div className="ws-health-ring">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={circumference * 0.25}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          </svg>
          <div className="ws-score-label">
            <span style={{ color: scoreColor }}>{healthScore}</span>
            <small>Health</small>
          </div>
        </div>
      </div>

      {/* Work State Switcher */}
      <section className="ws-section">
        <h2>Development State</h2>
        <div className="ws-states">
          {Object.values(workStates).map((s) => (
            <button
              key={s.key}
              className={`ws-state-card ${workState === s.key ? "active" : ""}`}
              style={workState === s.key ? { borderColor: s.color, background: s.color + "18" } : {}}
              onClick={() => setWorkState(s.key)}
            >
              <span className="ws-state-icon">{s.icon}</span>
              <span className="ws-state-name">{s.label}</span>
              <span className="ws-state-desc">{s.description}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5-Phase Milestones */}
      <section className="ws-section">
        <h2>Phase Milestones</h2>
        <p className="ws-section-hint">
          Phases are only marked complete when the linked metric threshold is met.
        </p>
        <div className="ws-phases">
          {phases.map((phase) => {
            const done = completedPhases.includes(phase.id);
            const metricVal = phase.metric === "healthScore"
              ? healthScore
              : (metrics[phase.metric] ?? 0);
            const canComplete = metricVal >= phase.threshold;
            return (
              <div key={phase.id} className={`ws-phase ${done ? "done" : ""}`}>
                <div className="ws-phase-num">{done ? "✓" : phase.id}</div>
                <div className="ws-phase-body">
                  <div className="ws-phase-title">{phase.title}</div>
                  <div className="ws-phase-desc">{phase.description}</div>
                  <div className="ws-phase-metric">
                    <span
                      className="ws-metric-pill"
                      style={{ color: canComplete ? "#22c55e" : "#f59e0b" }}
                    >
                      {phase.metric}: {metricVal}% / {phase.threshold}%
                    </span>
                    <span className="ws-metric-label">{phase.thresholdLabel}</span>
                  </div>
                </div>
                <div className="ws-phase-actions">
                  {done ? (
                    <button
                      className="ws-btn ws-btn-ghost"
                      onClick={() => uncompletePhase(phase.id)}
                    >
                      Undo
                    </button>
                  ) : (
                    <button
                      className={`ws-btn ${canComplete ? "ws-btn-primary" : "ws-btn-disabled"}`}
                      onClick={() => handleCompletePhase(phase.id)}
                      disabled={!canComplete}
                      title={!canComplete ? `Need ${phase.thresholdLabel}` : ""}
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Metrics */}
      <section className="ws-section">
        <div className="ws-section-row">
          <h2>Live Metrics</h2>
          {!editingMetrics ? (
            <button
              className="ws-btn ws-btn-ghost"
              onClick={() => {
                setMetricDraft({
                  stability: metrics.stability,
                  buildSuccess: metrics.buildSuccess,
                  testPass: metrics.testPass,
                });
                setEditingMetrics(true);
              }}
            >
              Edit
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button className="ws-btn ws-btn-ghost" onClick={() => setEditingMetrics(false)}>
                Cancel
              </button>
              <button className="ws-btn ws-btn-primary" onClick={saveMetrics}>
                Save
              </button>
            </div>
          )}
        </div>
        <div className="ws-metrics">
          {[
            { key: "stability", label: "System Stability", icon: "💓", color: "#ec4899" },
            { key: "buildSuccess", label: "Build Success", icon: "🔨", color: "#3b82f6" },
            { key: "testPass", label: "Test Pass Rate", icon: "🧪", color: "#8b5cf6" },
          ].map(({ key, label, icon, color }) => (
            <div key={key} className="ws-metric-card">
              <div className="ws-metric-icon" style={{ background: color + "22", color }}>
                {icon}
              </div>
              <div className="ws-metric-info">
                <span className="ws-metric-name">{label}</span>
                {editingMetrics ? (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={metricDraft[key]}
                    onChange={(e) =>
                      setMetricDraft((d) => ({ ...d, [key]: e.target.value }))
                    }
                    className="ws-metric-input"
                  />
                ) : (
                  <span className="ws-metric-value" style={{ color }}>
                    {metrics[key] ?? 0}%
                  </span>
                )}
              </div>
              <div className="ws-metric-bar-bg">
                <div
                  className="ws-metric-bar-fill"
                  style={{ width: `${metrics[key] ?? 0}%`, background: color }}
                />
              </div>
            </div>
          ))}
        </div>
        {metrics.lastUpdated && (
          <p className="ws-updated">
            Last updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
          </p>
        )}
      </section>

      {/* Certify */}
      <section className="ws-section ws-certify-section">
        <div className="ws-certify-body">
          <div>
            <h2>Deployment Certification</h2>
            <p>
              When all 5 phases are complete and Health Score ≥ 90, the BMS certifies
              this project as ready to deploy.
            </p>
          </div>
          <button
            className={`ws-btn ws-btn-certify ${completedPhases.length === phases.length && healthScore >= 90 ? "ready" : ""}`}
            onClick={handleCertify}
          >
            🏁 Certify
          </button>
        </div>
        <div className="ws-progress-bar-bg">
          <div
            className="ws-progress-bar-fill"
            style={{ width: `${(completedPhases.length / phases.length) * 100}%` }}
          />
        </div>
        <p className="ws-progress-label">
          {completedPhases.length} / {phases.length} phases complete
        </p>
      </section>

      {/* Milestone Feed */}
      {milestones.length > 0 && (
        <section className="ws-section">
          <h2>Milestone Feed</h2>
          <div className="ws-feed">
            {milestones.slice(0, 10).map((m) => (
              <div key={m.id} className="ws-feed-item">
                <span className="ws-feed-dot" style={{ background: m.type === "test" ? "#8b5cf6" : "#3b82f6" }} />
                <div className="ws-feed-content">
                  <span className="ws-feed-title">{m.message || m.type}</span>
                  <span className="ws-feed-time">
                    {new Date(m.timestamp).toLocaleString()}
                  </span>
                </div>
                {m.passRate != null && (
                  <span className="ws-feed-badge">{m.passRate}%</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const css = `
.ws-container {
  padding: 28px;
  color: white;
  min-height: 100%;
  position: relative;
}

.ws-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  animation: ws-fadein 0.2s ease;
}
.ws-toast.ok  { background: #166534; border: 1px solid #22c55e44; color: #86efac; }
.ws-toast.err { background: #7f1d1d; border: 1px solid #ef444444; color: #fca5a5; }
@keyframes ws-fadein { from { opacity:0; transform:translateY(-8px); } to { opacity:1; } }

.ws-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.ws-header h1 { margin: 0; font-size: 26px; }

.ws-subtitle {
  margin: 8px 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ws-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid;
}

.ws-certified {
  font-size: 13px;
  color: #22c55e;
}

.ws-health-ring {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.ws-score-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ws-score-label span {
  font-size: 22px;
  font-weight: 700;
}

.ws-score-label small {
  font-size: 10px;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ws-section {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  padding: 22px;
  margin-bottom: 20px;
}

.ws-section h2 {
  margin: 0 0 6px;
  font-size: 16px;
}

.ws-section-hint {
  font-size: 12px;
  color: rgba(255,255,255,0.45);
  margin: 0 0 16px;
}

.ws-section-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.ws-section-row h2 { margin: 0; }

/* State cards */
.ws-states {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 14px;
}

@media (max-width: 900px) {
  .ws-states { grid-template-columns: repeat(2, 1fr); }
}

.ws-state-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  padding: 16px;
  cursor: pointer;
  text-align: left;
  color: white;
  transition: all 0.15s;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ws-state-card:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.2);
}

.ws-state-card.active { transform: translateY(-2px); }

.ws-state-icon { font-size: 22px; }
.ws-state-name { font-weight: 600; font-size: 14px; }
.ws-state-desc { font-size: 12px; color: rgba(255,255,255,0.5); line-height: 1.4; }

/* Phases */
.ws-phases {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
}

.ws-phase {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  transition: border-color 0.15s;
}

.ws-phase.done {
  border-color: rgba(34,197,94,0.3);
  background: rgba(34,197,94,0.06);
}

.ws-phase-num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
  color: rgba(255,255,255,0.7);
}

.ws-phase.done .ws-phase-num {
  border-color: #22c55e;
  color: #22c55e;
}

.ws-phase-body { flex: 1; }
.ws-phase-title { font-weight: 600; font-size: 14px; margin-bottom: 3px; }
.ws-phase-desc { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 8px; }

.ws-phase-metric {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.ws-metric-pill {
  font-size: 12px;
  font-weight: 600;
}

.ws-metric-label {
  font-size: 11px;
  color: rgba(255,255,255,0.35);
}

.ws-phase-actions { display: flex; flex-direction: column; justify-content: center; }

/* Buttons */
.ws-btn {
  padding: 9px 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
  white-space: nowrap;
}

.ws-btn-primary {
  background: #52c41a;
  color: white;
}
.ws-btn-primary:hover { background: #65d430; }

.ws-btn-ghost {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.7);
}
.ws-btn-ghost:hover { background: rgba(255,255,255,0.12); }

.ws-btn-disabled {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.3);
  cursor: not-allowed;
}

/* Metrics */
.ws-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

@media (max-width: 700px) {
  .ws-metrics { grid-template-columns: 1fr; }
}

.ws-metric-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 16px;
}

.ws-metric-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 10px;
}

.ws-metric-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}

.ws-metric-name { font-size: 13px; color: rgba(255,255,255,0.6); }
.ws-metric-value { font-size: 20px; font-weight: 700; }

.ws-metric-input {
  width: 70px;
  padding: 4px 8px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  text-align: right;
}

.ws-metric-bar-bg {
  height: 4px;
  background: rgba(255,255,255,0.08);
  border-radius: 4px;
  overflow: hidden;
}

.ws-metric-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.ws-updated {
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  margin: 10px 0 0;
}

/* Certify */
.ws-certify-section {}
.ws-certify-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.ws-certify-body h2 { margin: 0 0 6px; }
.ws-certify-body p { font-size: 13px; color: rgba(255,255,255,0.5); margin: 0; }

.ws-btn-certify {
  padding: 12px 24px;
  font-size: 14px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.4);
  cursor: not-allowed;
}

.ws-btn-certify.ready {
  background: linear-gradient(135deg, #166534, #15803d);
  border-color: #22c55e66;
  color: #86efac;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(34,197,94,0.3);
}
.ws-btn-certify.ready:hover { box-shadow: 0 0 30px rgba(34,197,94,0.5); }

.ws-progress-bar-bg {
  height: 6px;
  background: rgba(255,255,255,0.08);
  border-radius: 6px;
  overflow: hidden;
}

.ws-progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #86efac);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.ws-progress-label {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  margin: 8px 0 0;
}

/* Milestone Feed */
.ws-feed {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 14px;
}

.ws-feed-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.ws-feed-item:last-child { border-bottom: none; }

.ws-feed-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ws-feed-content { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.ws-feed-title { font-size: 13px; }
.ws-feed-time { font-size: 11px; color: rgba(255,255,255,0.35); }

.ws-feed-badge {
  font-size: 12px;
  font-weight: 600;
  color: #86efac;
  background: rgba(34,197,94,0.1);
  padding: 3px 8px;
  border-radius: 8px;
}
`;
