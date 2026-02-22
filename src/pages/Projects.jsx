import React, { useState } from "react";
import { useProjects } from "../context/ProjectContext.jsx";

export default function Projects() {
  const { projects, activeProject, addProject, deleteProject, switchProject } = useProjects();
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "", color: "#7c3aed" });

  function handleAdd(e) {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    addProject(newProject);
    setNewProject({ name: "", description: "", color: "#7c3aed" });
    setShowModal(false);
  }

  const colors = ["#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626", "#db2777"];

  return (
    <div className="page-container">
      <style>{css}</style>

      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p className="page-subtitle">Manage your projects and switch between them</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + New Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div
            key={project.id}
            className={`project-card ${activeProject?.id === project.id ? "active" : ""}`}
            onClick={() => switchProject(project.id)}
          >
            <div className="project-color" style={{ background: project.color }} />
            <div className="project-info">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <span className="project-date">Created: {project.createdAt}</span>
            </div>
            {activeProject?.id === project.id && (
              <span className="active-badge">Active</span>
            )}
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (projects.length > 1) deleteProject(project.id);
              }}
              title={projects.length > 1 ? "Delete project" : "Cannot delete last project"}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Create New Project</h2>
            <form onSubmit={handleAdd}>
              <label>Project Name</label>
              <input
                type="text"
                value={newProject.name}
                onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))}
                placeholder="My Project"
                autoFocus
              />

              <label>Description</label>
              <input
                type="text"
                value={newProject.description}
                onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))}
                placeholder="Project description"
              />

              <label>Color</label>
              <div className="color-picker">
                {colors.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`color-opt ${newProject.color === c ? "selected" : ""}`}
                    style={{ background: c }}
                    onClick={() => setNewProject(p => ({ ...p, color: c }))}
                  />
                ))}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const css = `
.page-container {
  padding: 30px;
  color: white;
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
}

.page-subtitle {
  color: rgba(255,255,255,0.6);
  margin: 5px 0 0;
}

.btn-primary {
  padding: 12px 24px;
  background: #52c41a;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  background: #45a514;
}

.btn-secondary {
  padding: 12px 24px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  color: white;
  cursor: pointer;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.project-card {
  position: relative;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  gap: 16px;
}

.project-card:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.2);
}

.project-card.active {
  border-color: #52c41a;
  box-shadow: 0 0 0 1px #52c41a;
}

.project-color {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  flex-shrink: 0;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-info h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.project-info p {
  margin: 0 0 8px;
  font-size: 13px;
  color: rgba(255,255,255,0.6);
}

.project-date {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
}

.active-badge {
  position: absolute;
  top: 12px;
  right: 40px;
  background: #52c41a;
  color: white;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.delete-btn:hover {
  background: #dc2626;
  color: white;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: linear-gradient(180deg, #1e1e2e, #15151f);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  padding: 30px;
  width: 420px;
  max-width: 90vw;
}

.modal h2 {
  margin: 0 0 24px;
  font-size: 20px;
}

.modal label {
  display: block;
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  margin-bottom: 8px;
}

.modal input {
  width: 100%;
  padding: 12px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  color: white;
  margin-bottom: 20px;
}

.color-picker {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.color-opt {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 2px solid transparent;
  cursor: pointer;
}

.color-opt.selected {
  border-color: white;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.3);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
`;
