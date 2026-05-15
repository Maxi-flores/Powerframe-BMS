import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const ProjectContext = createContext();
const PROJECTS_KEY = "gms_projects";
const ACTIVE_PROJECT_KEY = "gms_active_project";
const LEGACY_PROJECTS_KEY = "bms_projects";
const LEGACY_ACTIVE_PROJECT_KEY = "bms_active_project";

const DEFAULT_PROJECTS = [
  { id: 1, name: "PowerFrame GMS", description: "Game Manager System", color: "#7c3aed", createdAt: "2026-01-15" },
  { id: 2, name: "Client Portal", description: "Customer facing dashboard", color: "#2563eb", createdAt: "2026-02-01" },
];

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    const saved =
      localStorage.getItem(PROJECTS_KEY) ??
      localStorage.getItem(LEGACY_PROJECTS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });

  const [activeProject, setActiveProject] = useState(() => {
    const savedId =
      localStorage.getItem(ACTIVE_PROJECT_KEY) ??
      localStorage.getItem(LEGACY_ACTIVE_PROJECT_KEY);
    const saved =
      localStorage.getItem(PROJECTS_KEY) ??
      localStorage.getItem(LEGACY_PROJECTS_KEY);
    const projectList = saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    return projectList.find(p => p.id === Number(savedId)) || projectList[0];
  });

  useEffect(() => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (activeProject) {
      localStorage.setItem(ACTIVE_PROJECT_KEY, activeProject.id);
    }
  }, [activeProject]);

  function addProject(project) {
    const newProject = {
      ...project,
      id: Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }

  function updateProject(id, updates) {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    if (activeProject?.id === id) {
      setActiveProject(prev => ({ ...prev, ...updates }));
    }
  }

  function deleteProject(id) {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProject?.id === id) {
      setActiveProject(projects.find(p => p.id !== id) || null);
    }
  }

  function switchProject(id) {
    const project = projects.find(p => p.id === id);
    if (project) {
      setActiveProject(project);
    }
  }

  // ── Semantic Bridge (TheRocketTree-App) ───────────────────────────────────
  const [activeCandidate, setActiveCandidate] = useState(null);

  const clearActiveCandidate = useCallback(() => {
    setActiveCandidate(null);
  }, []);

  useEffect(() => {
    function handleBridgeMessage(event) {
      const { type, unityActionCandidate, runtimeStatus } = event.data || {};
      if (type !== "TRT_BRIDGE_LAB_CANDIDATE") return;

      setActiveCandidate({ candidate: unityActionCandidate, status: runtimeStatus });

      // Inject a volatile (in-memory only) testing task into the active project
      // when the bridge signals an actionable candidate
      if (runtimeStatus?.meaning && runtimeStatus.meaning !== "no_action") {
        const volatileTask = {
          id: `bridge-${Date.now()}`,
          title: unityActionCandidate?.label || "Bridge Lab Test",
          description: `[Bridge Lab] ${runtimeStatus.meaning}`,
          status: "bridge-test",
          volatile: true,
          createdAt: new Date().toISOString(),
        };
        // Inject into in-memory tasks without touching localStorage or Firebase
        setActiveProject(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            _volatileTasks: [...(prev._volatileTasks || []), volatileTask],
          };
        });
      }
    }

    window.addEventListener("message", handleBridgeMessage);
    return () => window.removeEventListener("message", handleBridgeMessage);
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        addProject,
        updateProject,
        deleteProject,
        switchProject,
        activeCandidate,
        clearActiveCandidate,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within ProjectProvider");
  }
  return context;
}
