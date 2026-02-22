import React, { useState } from "react";
import { useProjects } from "../context/ProjectContext.jsx";

export default function Files() {
  const { activeProject } = useProjects();
  const [files, setFiles] = useState([
    { id: 1, name: "Project Brief.pdf", type: "pdf", size: "2.4 MB", modified: "2026-02-20" },
    { id: 2, name: "Design Mockups.fig", type: "figma", size: "15.8 MB", modified: "2026-02-19" },
    { id: 3, name: "API Documentation.md", type: "doc", size: "124 KB", modified: "2026-02-22" },
    { id: 4, name: "assets.zip", type: "archive", size: "45.2 MB", modified: "2026-02-18" },
    { id: 5, name: "meeting-notes.txt", type: "doc", size: "8 KB", modified: "2026-02-21" },
  ]);

  const [view, setView] = useState("list");

  const typeIcons = {
    pdf: "📄",
    figma: "🎨",
    doc: "📝",
    archive: "📦",
    image: "🖼️",
    default: "📁"
  };

  function deleteFile(id) {
    setFiles(prev => prev.filter(f => f.id !== id));
  }

  return (
    <div className="page-container">
      <style>{css}</style>

      <div className="page-header">
        <div>
          <h1>Bestanden</h1>
          <p className="page-subtitle">{activeProject?.name} — Files & Documents</p>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>☰</button>
            <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}>⊞</button>
          </div>
          <button className="btn-primary">+ Upload</button>
        </div>
      </div>

      <div className="storage-bar">
        <div className="storage-info">
          <span>Storage used</span>
          <span>63.5 MB / 1 GB</span>
        </div>
        <div className="storage-track">
          <div className="storage-fill" style={{ width: "6.35%" }} />
        </div>
      </div>

      <div className={`files-${view}`}>
        {files.map(file => (
          <div key={file.id} className="file-item">
            <span className="file-icon">{typeIcons[file.type] || typeIcons.default}</span>
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <span className="file-meta">{file.size} • {file.modified}</span>
            </div>
            <button className="delete-btn" onClick={() => deleteFile(file.id)}>×</button>
          </div>
        ))}
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-header h1 { margin: 0; font-size: 28px; }
.page-subtitle { color: rgba(255,255,255,0.6); margin: 5px 0 0; }

.header-actions {
  display: flex;
  gap: 12px;
}

.view-toggle {
  display: flex;
  background: rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 4px;
}

.view-toggle button {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.5);
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.view-toggle button.active {
  background: rgba(255,255,255,0.12);
  color: white;
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

.storage-bar {
  background: rgba(255,255,255,0.04);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.storage-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  margin-bottom: 10px;
}

.storage-track {
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 999px;
  overflow: hidden;
}

.storage-fill {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #2563eb);
  border-radius: 999px;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  cursor: pointer;
}

.file-item:hover {
  background: rgba(255,255,255,0.08);
}

.files-grid .file-item {
  flex-direction: column;
  text-align: center;
  padding: 24px;
}

.file-icon {
  font-size: 28px;
}

.files-grid .file-icon {
  font-size: 40px;
  margin-bottom: 8px;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.files-grid .file-info {
  width: 100%;
}

.file-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
}

.delete-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  font-size: 18px;
}

.delete-btn:hover {
  background: #dc2626;
  color: white;
}

.files-grid .delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}

.files-grid .file-item {
  position: relative;
}
`;
