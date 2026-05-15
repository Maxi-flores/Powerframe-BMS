import React, { useState, useRef, useEffect } from "react";
import { useProjects } from "../context/ProjectContext.jsx";

// Widget types with their quickview data
const WIDGET_TYPES = {
  tasks: { title: "Tasks", icon: "✓", color: "#3b82f6", getData: () => ({ count: 12, label: "3 due today" }) },
  calendar: { title: "Calendar", icon: "📅", color: "#8b5cf6", getData: () => ({ count: 4, label: "events this week" }) },
  files: { title: "Files", icon: "📁", color: "#10b981", getData: () => ({ count: 48, label: "63.5 MB used" }) },
  messages: { title: "Messages", icon: "✉", color: "#f59e0b", getData: () => ({ count: 8, label: "unread" }) },
  analytics: { title: "Analytics", icon: "📊", color: "#ec4899", getData: () => ({ count: "89%", label: "performance" }) },
  notes: { title: "Notes", icon: "📝", color: "#06b6d4", getData: () => ({ count: 15, label: "total notes" }) },
  team: { title: "Team", icon: "👥", color: "#84cc16", getData: () => ({ count: 5, label: "members" }) },
  progress: { title: "Progress", icon: "📈", color: "#f97316", getData: () => ({ count: "58%", label: "complete" }) },
};

const DEFAULT_TABS = [
  { id: "overview", name: "Overview", widgets: [
    { id: "w1", type: "tasks", x: 0, y: 0, w: 4, h: 2 },
    { id: "w2", type: "calendar", x: 4, y: 0, w: 4, h: 2 },
    { id: "w3", type: "files", x: 8, y: 0, w: 4, h: 2 },
    { id: "w4", type: "messages", x: 0, y: 2, w: 3, h: 2 },
    { id: "w5", type: "analytics", x: 3, y: 2, w: 3, h: 2 },
    { id: "w6", type: "notes", x: 6, y: 2, w: 3, h: 2 },
    { id: "w7", type: "progress", x: 9, y: 2, w: 3, h: 2 },
  ]},
  { id: "analytics", name: "Analytics", widgets: [
    { id: "a1", type: "analytics", x: 0, y: 0, w: 6, h: 2 },
    { id: "a2", type: "progress", x: 6, y: 0, w: 6, h: 2 },
  ]},
];

export default function Overview() {
  const { activeProject } = useProjects();
  const gridRef = useRef(null);

  // Project-scoped tabs stored in localStorage
  const storageKey = `gms_tabs_${activeProject?.id || "default"}`;
  const [tabs, setTabs] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : DEFAULT_TABS;
  });

  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const [dragging, setDragging] = useState(null);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [showAddTab, setShowAddTab] = useState(false);
  const [newTabName, setNewTabName] = useState("");

  // Save tabs to localStorage when changed
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tabs));
  }, [tabs, storageKey]);

  // Reset tabs when project changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    setTabs(saved ? JSON.parse(saved) : DEFAULT_TABS);
    setActiveTab(tabs[0]?.id || "overview");
  }, [activeProject?.id]);

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];

  function addTab() {
    if (!newTabName.trim()) return;
    const newTab = { id: Date.now().toString(), name: newTabName, widgets: [] };
    setTabs(prev => [...prev, newTab]);
    setActiveTab(newTab.id);
    setNewTabName("");
    setShowAddTab(false);
  }

  function deleteTab(tabId) {
    if (tabs.length <= 1) return;
    setTabs(prev => prev.filter(t => t.id !== tabId));
    if (activeTab === tabId) setActiveTab(tabs[0].id);
  }

  function addWidget(type) {
    const widget = { id: Date.now().toString(), type, x: 0, y: 0, w: 4, h: 2 };
    setTabs(prev => prev.map(t =>
      t.id === activeTab ? { ...t, widgets: [...t.widgets, widget] } : t
    ));
    setShowAddWidget(false);
  }

  function removeWidget(widgetId) {
    setTabs(prev => prev.map(t =>
      t.id === activeTab ? { ...t, widgets: t.widgets.filter(w => w.id !== widgetId) } : t
    ));
  }

  function handleDragStart(e, widget) {
    setDragging(widget);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e, targetX, targetY) {
    e.preventDefault();
    if (!dragging) return;

    setTabs(prev => prev.map(t => {
      if (t.id !== activeTab) return t;
      return {
        ...t,
        widgets: t.widgets.map(w =>
          w.id === dragging.id ? { ...w, x: targetX, y: targetY } : w
        )
      };
    }));
    setDragging(null);
  }

  return (
    <div className="overview-container">
      <style>{css}</style>

      {/* Header */}
      <div className="overview-header">
        <div className="header-info">
          <h1>Dashboard</h1>
          <p>
            <span className="project-badge" style={{ background: activeProject?.color }}>
              {activeProject?.name}
            </span>
          </p>
        </div>
        <button className="btn-add-widget" onClick={() => setShowAddWidget(true)}>
          + Add Widget
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-bar">
        <div className="tabs-list">
          {tabs.map(tab => (
            <div key={tab.id} className={`tab ${activeTab === tab.id ? "active" : ""}`}>
              <button className="tab-btn" onClick={() => setActiveTab(tab.id)}>
                {tab.name}
              </button>
              {tabs.length > 1 && (
                <button className="tab-close" onClick={() => deleteTab(tab.id)}>×</button>
              )}
            </div>
          ))}
        </div>
        <button className="tab-add" onClick={() => setShowAddTab(true)}>+</button>
      </div>

      {/* Widget Grid */}
      <div className="widget-grid" ref={gridRef}>
        {/* Drop zones */}
        {Array.from({ length: 12 }).map((_, x) =>
          Array.from({ length: 6 }).map((_, y) => (
            <div
              key={`zone-${x}-${y}`}
              className="drop-zone"
              style={{ gridColumn: x + 1, gridRow: y + 1 }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, x, y)}
            />
          ))
        )}

        {/* Widgets */}
        {currentTab?.widgets.map(widget => {
          const config = WIDGET_TYPES[widget.type];
          const data = config.getData();
          return (
            <div
              key={widget.id}
              className={`widget ${dragging?.id === widget.id ? "dragging" : ""}`}
              style={{
                gridColumn: `${widget.x + 1} / span ${widget.w}`,
                gridRow: `${widget.y + 1} / span ${widget.h}`,
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, widget)}
              onDragEnd={() => setDragging(null)}
            >
              <div className="widget-header">
                <span className="widget-icon" style={{ background: config.color }}>{config.icon}</span>
                <span className="widget-title">{config.title}</span>
                <button className="widget-remove" onClick={() => removeWidget(widget.id)}>×</button>
              </div>
              <div className="widget-body">
                <div className="widget-count">{data.count}</div>
                <div className="widget-label">{data.label}</div>
              </div>
              <div className="widget-drag-hint">Drag to move</div>
            </div>
          );
        })}

        {currentTab?.widgets.length === 0 && (
          <div className="empty-state">
            <span>📦</span>
            <p>No widgets yet</p>
            <button onClick={() => setShowAddWidget(true)}>Add your first widget</button>
          </div>
        )}
      </div>

      {/* Add Widget Modal */}
      {showAddWidget && (
        <div className="modal-overlay" onClick={() => setShowAddWidget(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add Widget</h2>
            <div className="widget-picker">
              {Object.entries(WIDGET_TYPES).map(([key, config]) => (
                <button key={key} className="widget-option" onClick={() => addWidget(key)}>
                  <span className="option-icon" style={{ background: config.color }}>{config.icon}</span>
                  <span>{config.title}</span>
                </button>
              ))}
            </div>
            <button className="btn-cancel" onClick={() => setShowAddWidget(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Add Tab Modal */}
      {showAddTab && (
        <div className="modal-overlay" onClick={() => setShowAddTab(false)}>
          <div className="modal small" onClick={e => e.stopPropagation()}>
            <h2>New Tab</h2>
            <input
              type="text"
              value={newTabName}
              onChange={e => setNewTabName(e.target.value)}
              placeholder="Tab name"
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowAddTab(false)}>Cancel</button>
              <button className="btn-primary" onClick={addTab}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const css = `
.overview-container {
  padding: 24px;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.overview-header h1 {
  margin: 0;
  font-size: 26px;
}

.overview-header p {
  margin: 8px 0 0;
}

.project-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.btn-add-widget {
  padding: 10px 20px;
  background: #52c41a;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

/* Tabs */
.tabs-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.tabs-list {
  display: flex;
  gap: 6px;
  flex: 1;
  overflow-x: auto;
}

.tab {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  overflow: hidden;
}

.tab.active {
  background: rgba(120,140,255,0.15);
  border-color: rgba(140,160,255,0.4);
}

.tab-btn {
  padding: 10px 16px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
}

.tab-close {
  padding: 10px 10px 10px 0;
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  font-size: 16px;
}

.tab-close:hover { color: #f87171; }

.tab-add {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px dashed rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  font-size: 18px;
}

.tab-add:hover { background: rgba(255,255,255,0.08); color: white; }

/* Widget Grid */
.widget-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 12px;
  min-height: 400px;
  position: relative;
}

.drop-zone {
  border: 1px dashed transparent;
  border-radius: 8px;
  transition: all 0.15s;
}

.drop-zone:hover {
  border-color: rgba(82,196,26,0.4);
  background: rgba(82,196,26,0.05);
}

/* Widgets */
.widget {
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 16px;
  cursor: grab;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.widget:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.3);
  border-color: rgba(140,160,255,0.4);
}

.widget.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.widget-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.widget-title {
  font-weight: 600;
  font-size: 14px;
  flex: 1;
}

.widget-remove {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: rgba(255,255,255,0.06);
  border: none;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s;
}

.widget:hover .widget-remove { opacity: 1; }
.widget-remove:hover { background: #dc2626; color: white; }

.widget-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.widget-count {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff, rgba(200,220,255,0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.widget-label {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  margin-top: 4px;
}

.widget-drag-hint {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 10px;
  color: rgba(255,255,255,0.25);
  opacity: 0;
  transition: opacity 0.15s;
}

.widget:hover .widget-drag-hint { opacity: 1; }

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.4);
}

.empty-state span { font-size: 48px; margin-bottom: 16px; }
.empty-state p { margin: 0 0 16px; }

.empty-state button {
  padding: 12px 24px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  color: white;
  cursor: pointer;
}

/* Modals */
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
  width: 480px;
  max-width: 90vw;
}

.modal.small { width: 340px; }

.modal h2 {
  margin: 0 0 24px;
  font-size: 20px;
}

.widget-picker {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.widget-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  text-align: left;
}

.widget-option:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.2);
}

.option-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.modal input {
  width: 100%;
  padding: 14px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  color: white;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 12px 24px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  color: white;
  cursor: pointer;
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
`;
