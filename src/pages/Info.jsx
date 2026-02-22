import React from "react";
import { useProjects } from "../context/ProjectContext.jsx";

export default function Info() {
  const { activeProject } = useProjects();

  return (
    <div className="page-container">
      <style>{css}</style>

      <div className="page-header">
        <h1>Info</h1>
        <p className="page-subtitle">System information & help</p>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>Current Project</h3>
          <div className="project-info">
            <div className="project-color" style={{ background: activeProject?.color }} />
            <div>
              <strong>{activeProject?.name}</strong>
              <p>{activeProject?.description}</p>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>System Status</h3>
          <div className="status-list">
            <div className="status-row">
              <span className="status-dot online" />
              <span>API Server</span>
              <span className="status-label">Online</span>
            </div>
            <div className="status-row">
              <span className="status-dot online" />
              <span>Database</span>
              <span className="status-label">Connected</span>
            </div>
            <div className="status-row">
              <span className="status-dot online" />
              <span>Auth Service</span>
              <span className="status-label">Active</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>Version</h3>
          <div className="version-info">
            <span className="version-badge">V1.0.0</span>
            <p>PowerFrame BMS Dashboard</p>
            <p className="version-date">Released: February 2026</p>
          </div>
        </div>

        <div className="info-card">
          <h3>Quick Help</h3>
          <div className="help-links">
            <a href="#" className="help-link">📖 Documentation</a>
            <a href="#" className="help-link">💬 Support Chat</a>
            <a href="#" className="help-link">🎥 Video Tutorials</a>
            <a href="#" className="help-link">📧 Contact Us</a>
          </div>
        </div>

        <div className="info-card wide">
          <h3>Keyboard Shortcuts</h3>
          <div className="shortcuts-grid">
            <div className="shortcut">
              <kbd>Ctrl</kbd> + <kbd>K</kbd>
              <span>Quick Search</span>
            </div>
            <div className="shortcut">
              <kbd>Ctrl</kbd> + <kbd>N</kbd>
              <span>New Project</span>
            </div>
            <div className="shortcut">
              <kbd>Ctrl</kbd> + <kbd>D</kbd>
              <span>Dashboard</span>
            </div>
            <div className="shortcut">
              <kbd>Ctrl</kbd> + <kbd>P</kbd>
              <span>Switch Project</span>
            </div>
          </div>
        </div>
      </div>
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
  margin-bottom: 30px;
}

.page-header h1 { margin: 0; font-size: 28px; }
.page-subtitle { color: rgba(255,255,255,0.6); margin: 5px 0 0; }

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 24px;
}

.info-card.wide {
  grid-column: 1 / -1;
}

.info-card h3 {
  margin: 0 0 20px;
  font-size: 16px;
  color: rgba(255,255,255,0.8);
}

.project-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.project-color {
  width: 48px;
  height: 48px;
  border-radius: 12px;
}

.project-info strong {
  display: block;
  font-size: 16px;
}

.project-info p {
  margin: 4px 0 0;
  font-size: 13px;
  color: rgba(255,255,255,0.5);
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot.online { background: #22c55e; }
.status-dot.offline { background: #ef4444; }

.status-label {
  margin-left: auto;
  font-size: 12px;
  color: #22c55e;
}

.version-info {
  text-align: center;
}

.version-badge {
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  border-radius: 20px;
  font-weight: 700;
  font-size: 18px;
}

.version-info p {
  margin: 12px 0 0;
  color: rgba(255,255,255,0.6);
}

.version-date {
  font-size: 12px !important;
  color: rgba(255,255,255,0.4) !important;
}

.help-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.help-link {
  display: block;
  padding: 12px 16px;
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
  color: white;
  text-decoration: none;
  font-size: 14px;
}

.help-link:hover {
  background: rgba(255,255,255,0.08);
}

.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.shortcut {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.shortcut span {
  margin-left: auto;
  color: rgba(255,255,255,0.5);
}

kbd {
  padding: 4px 8px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  font-family: inherit;
  font-size: 12px;
}
`;
