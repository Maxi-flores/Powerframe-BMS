import React, { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext();

const DEFAULT_PROJECTS = [
  { id: 1, name: "PowerFrame BMS", description: "Building Management System", color: "#7c3aed", createdAt: "2026-01-15" },
  { id: 2, name: "Client Portal", description: "Customer facing dashboard", color: "#2563eb", createdAt: "2026-02-01" },
];

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("bms_projects");
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });

  const [activeProject, setActiveProject] = useState(() => {
    const savedId = localStorage.getItem("bms_active_project");
    const saved = localStorage.getItem("bms_projects");
    const projectList = saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    return projectList.find(p => p.id === Number(savedId)) || projectList[0];
  });

  useEffect(() => {
    localStorage.setItem("bms_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (activeProject) {
      localStorage.setItem("bms_active_project", activeProject.id);
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

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        addProject,
        updateProject,
        deleteProject,
        switchProject,
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
