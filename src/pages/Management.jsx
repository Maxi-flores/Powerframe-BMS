import React, { useState } from "react";
import { useProjects } from "../context/ProjectContext.jsx";

export default function Management() {
  const { projects, activeProject, updateProject, deleteProject } = useProjects();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [users] = useState([
    { id: 1, name: "Admin User", email: "admin@powerframe.io", role: "Owner", status: "active" },
    { id: 2, name: "Team Member", email: "team@powerframe.io", role: "Editor", status: "active" },
    { id: 3, name: "Viewer", email: "view@powerframe.io", role: "Viewer", status: "pending" },
  ]);

  function startEdit(project) {
    setEditingId(project.id);
    setEditForm({ name: project.name, description: project.description });
  }

  function saveEdit() {
    updateProject(editingId, editForm);
    setEditingId(null);
  }

  return (
    <div className="page-container">
      <style>{css}</style>

      <div className="page-header">
        <h1>Management</h1>
        <p className="page-subtitle">Manage projects, users and permissions</p>
      </div>

      <div className="mgmt-tabs">
        <button className="tab active">Projects</button>
        <button className="tab">Users</button>
        <button className="tab">Permissions</button>
      </div>

      <div className="mgmt-section">
        <h3>All Projects</h3>
        <div className="mgmt-table">
          <div className="table-header">
            <span>Project</span>
            <span>Status</span>
            <span>Created</span>
            <span>Actions</span>
          </div>
          {projects.map(p => (
            <div key={p.id} className={`table-row ${p.id === activeProject?.id ? "active" : ""}`}>
              {editingId === p.id ? (
                <div className="edit-form">
                  <input
                    value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Project name"
                  />
                  <input
                    value={editForm.description}
                    onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Description"
                  />
                  <button className="btn-save" onClick={saveEdit}>Save</button>
                  <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <span className="project-cell">
                    <span className="project-dot" style={{ background: p.color }} />
                    <span>
                      <strong>{p.name}</strong>
                      <small>{p.description}</small>
                    </span>
                  </span>
                  <span className="status-badge active">Active</span>
                  <span>{p.createdAt}</span>
                  <span className="actions">
                    <button onClick={() => startEdit(p)}>Edit</button>
                    {projects.length > 1 && (
                      <button className="danger" onClick={() => deleteProject(p.id)}>Delete</button>
                    )}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mgmt-section">
        <h3>Team Members</h3>
        <div className="mgmt-table">
          <div className="table-header">
            <span>User</span>
            <span>Role</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {users.map(u => (
            <div key={u.id} className="table-row">
              <span className="user-cell">
                <span className="user-avatar">{u.name.charAt(0)}</span>
                <span>
                  <strong>{u.name}</strong>
                  <small>{u.email}</small>
                </span>
              </span>
              <span className={`role-badge ${u.role.toLowerCase()}`}>{u.role}</span>
              <span className={`status-badge ${u.status}`}>{u.status}</span>
              <span className="actions">
                <button>Edit</button>
                {u.role !== "Owner" && <button className="danger">Remove</button>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const css = `
.page-container { padding: 30px; color: white; }
.page-header { margin-bottom: 24px; }
.page-header h1 { margin: 0; font-size: 28px; }
.page-subtitle { color: rgba(255,255,255,0.6); margin: 5px 0 0; }

.mgmt-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.tab {
  padding: 10px 20px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
}

.tab.active {
  background: rgba(120,140,255,0.15);
  border-color: rgba(140,160,255,0.4);
  color: white;
}

.mgmt-section {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.mgmt-section h3 {
  margin: 0 0 20px;
  font-size: 16px;
}

.mgmt-table {
  display: flex;
  flex-direction: column;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  font-weight: 600;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  align-items: center;
}

.table-row.active { background: rgba(82,196,26,0.08); }

.project-cell, .user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.project-cell span, .user-cell span {
  display: flex;
  flex-direction: column;
}

.project-cell strong, .user-cell strong { font-size: 14px; }
.project-cell small, .user-cell small { font-size: 12px; color: rgba(255,255,255,0.5); }

.status-badge, .role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  width: fit-content;
}

.status-badge.active { background: rgba(34,197,94,0.2); color: #22c55e; }
.status-badge.pending { background: rgba(245,158,11,0.2); color: #f59e0b; }

.role-badge.owner { background: rgba(124,58,237,0.2); color: #a78bfa; }
.role-badge.editor { background: rgba(37,99,235,0.2); color: #60a5fa; }
.role-badge.viewer { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); }

.actions {
  display: flex;
  gap: 8px;
}

.actions button {
  padding: 6px 14px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 12px;
}

.actions button.danger { color: #f87171; border-color: rgba(248,113,113,0.3); }

.edit-form {
  grid-column: 1 / -1;
  display: flex;
  gap: 12px;
  align-items: center;
}

.edit-form input {
  flex: 1;
  padding: 10px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: white;
}

.btn-save {
  padding: 10px 20px;
  background: #52c41a;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.btn-cancel {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
}
`;
