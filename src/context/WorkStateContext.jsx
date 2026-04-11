import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// The four workflow states a project can be in
export const WORK_STATES = {
  Bootstrapping: {
    key: "Bootstrapping",
    label: "Bootstrapping",
    color: "#f59e0b",
    icon: "🚀",
    description: "Initial setup, scaffolding and environment configuration",
    order: 0,
  },
  Testing: {
    key: "Testing",
    label: "Testing",
    color: "#3b82f6",
    icon: "🧪",
    description: "Actively running tests, validating behaviour and fixing issues",
    order: 1,
  },
  Reviewing: {
    key: "Reviewing",
    label: "Reviewing",
    color: "#8b5cf6",
    icon: "🔍",
    description: "Code review, quality checks and peer feedback phase",
    order: 2,
  },
  Deployment_Ready: {
    key: "Deployment_Ready",
    label: "Deployment Ready",
    color: "#22c55e",
    icon: "✅",
    description: "All checks passed — BMS certified for deployment",
    order: 3,
  },
};

// The five milestone phases linked to hardware/stability metrics
export const PHASES = [
  {
    id: 1,
    title: "Environment Bootstrap",
    description: "Toolchain installed, repo cloned, dev server running",
    requiredState: "Bootstrapping",
    metric: "stability",
    threshold: 80,
    thresholdLabel: "80% stability for 2 min",
  },
  {
    id: 2,
    title: "Core Feature Build",
    description: "Primary features implemented and compiling without errors",
    requiredState: "Testing",
    metric: "buildSuccess",
    threshold: 100,
    thresholdLabel: "100% build success rate",
  },
  {
    id: 3,
    title: "Test Suite Green",
    description: "All automated tests passing, coverage threshold met",
    requiredState: "Testing",
    metric: "testPass",
    threshold: 95,
    thresholdLabel: "≥95% test pass rate",
  },
  {
    id: 4,
    title: "Code Review Approved",
    description: "Peer review complete, no blocking issues, quality score met",
    requiredState: "Reviewing",
    metric: "stability",
    threshold: 100,
    thresholdLabel: "100% stability for 5 min",
  },
  {
    id: 5,
    title: "Deployment Certified",
    description: "BMS certifies all phases complete — ready to ship",
    requiredState: "Deployment_Ready",
    metric: "healthScore",
    threshold: 90,
    thresholdLabel: "Health Score ≥ 90",
  },
];

const WorkStateContext = createContext();

const STORAGE_KEY = "bms_workstate";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function computeHealthScore(metrics, completedPhases) {
  const { stability = 0, buildSuccess = 0, testPass = 0 } = metrics;
  const phaseScore = (completedPhases.length / PHASES.length) * 40;
  const metricScore = ((stability + buildSuccess + testPass) / 3) * 0.6;
  return Math.min(100, Math.round(phaseScore + metricScore));
}

export function WorkStateProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = loadState();
    return (
      saved || {
        currentState: "Bootstrapping",
        completedPhases: [],
        milestones: [],
        metrics: {
          stability: 72,
          buildSuccess: 0,
          testPass: 0,
          lastUpdated: null,
        },
        certifiedAt: null,
      }
    );
  });

  // Persist whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const healthScore = computeHealthScore(state.metrics, state.completedPhases);

  // Transition to a new WorkState
  const setWorkState = useCallback((newState) => {
    if (!WORK_STATES[newState]) return;
    setState((prev) => ({ ...prev, currentState: newState }));
  }, []);

  // Mark a phase complete (only if metric threshold is met)
  const completePhase = useCallback(
    (phaseId) => {
      const phase = PHASES.find((p) => p.id === phaseId);
      if (!phase) return { success: false, reason: "Phase not found" };

      // healthScore is computed outside of state.metrics — handle it as a special case
      const metricValue =
        phase.metric === "healthScore" ? healthScore : (state.metrics[phase.metric] ?? 0);

      if (metricValue < phase.threshold) {
        return {
          success: false,
          reason: `Metric "${phase.metric}" is ${metricValue} — need ${phase.threshold} (${phase.thresholdLabel})`,
        };
      }

      setState((prev) => ({
        ...prev,
        completedPhases: prev.completedPhases.includes(phaseId)
          ? prev.completedPhases
          : [...prev.completedPhases, phaseId],
      }));
      return { success: true };
    },
    [state.metrics, healthScore]
  );

  // Uncomplete a phase
  const uncompletePhase = useCallback((phaseId) => {
    setState((prev) => ({
      ...prev,
      completedPhases: prev.completedPhases.filter((id) => id !== phaseId),
      certifiedAt: null,
    }));
  }, []);

  // Push a milestone (called from git hook or manually)
  const pushMilestone = useCallback((milestone) => {
    setState((prev) => ({
      ...prev,
      milestones: [
        {
          ...milestone,
          id: Date.now(),
          timestamp: new Date().toISOString(),
        },
        ...prev.milestones.slice(0, 49), // keep last 50
      ],
      metrics: {
        ...prev.metrics,
        buildSuccess: milestone.type === "build" ? 100 : prev.metrics.buildSuccess,
        testPass: milestone.type === "test" ? (milestone.passRate ?? 100) : prev.metrics.testPass,
        lastUpdated: new Date().toISOString(),
      },
    }));
  }, []);

  // Update raw hardware/stability metrics
  const updateMetrics = useCallback((updates) => {
    setState((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        ...updates,
        lastUpdated: new Date().toISOString(),
      },
    }));
  }, []);

  // Certify the project as Deployment_Ready
  const certify = useCallback(() => {
    const allDone = PHASES.every((p) => state.completedPhases.includes(p.id));
    if (!allDone) return { success: false, reason: "Not all phases are complete" };
    if (healthScore < 90) return { success: false, reason: `Health Score is ${healthScore} — need ≥90` };

    setState((prev) => ({
      ...prev,
      currentState: "Deployment_Ready",
      certifiedAt: new Date().toISOString(),
    }));
    return { success: true };
  }, [state.completedPhases, healthScore]);

  return (
    <WorkStateContext.Provider
      value={{
        workState: state.currentState,
        workStateConfig: WORK_STATES[state.currentState],
        completedPhases: state.completedPhases,
        milestones: state.milestones,
        metrics: state.metrics,
        healthScore,
        certifiedAt: state.certifiedAt,
        setWorkState,
        completePhase,
        uncompletePhase,
        pushMilestone,
        updateMetrics,
        certify,
        phases: PHASES,
        workStates: WORK_STATES,
      }}
    >
      {children}
    </WorkStateContext.Provider>
  );
}

export function useWorkState() {
  const context = useContext(WorkStateContext);
  if (!context) {
    throw new Error("useWorkState must be used within WorkStateProvider");
  }
  return context;
}
