import React, { useState } from "react";
import { useProjects } from "../context/ProjectContext.jsx";

export default function Tasks() {
  const { activeProject } = useProjects();
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review dashboard designs", status: "completed", priority: "high" },
    { id: 2, title: "Implement user authentication", status: "in_progress", priority: "high" },
    { id: 3, title: "Set up database schema", status: "in_progress", priority: "medium" },
    { id: 4, title: "Write API documentation", status: "pending", priority: "low" },
    { id: 5, title: "Configure CI/CD pipeline", status: "pending", priority: "medium" },
  ]);
  const [newTask, setNewTask] = useState("");

  function addTask(e) {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now(),
      title: newTask,
      status: "pending",
      priority: "medium"
    }]);
    setNewTask("");
  }

  function toggleStatus(id) {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nextStatus = { pending: "in_progress", in_progress: "completed", completed: "pending" };
      return { ...t, status: nextStatus[t.status] };
    }));
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  const statusColors = {
    pending: "#f59e0b",
    in_progress: "#3b82f6",
    completed: "#22c55e"
  };

  return (
    <div className="page-container">
      <style>{css}</style>

      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p className="page-subtitle">
            {activeProject?.name} — {tasks.filter(t => t.status === "completed").length}/{tasks.length} completed
          </p>
        </div>
      </div>

      <form className="add-task-form" onSubmit={addTask}>
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button type="submit">+ Add</button>
      </form>

      <div className="tasks-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.status}`}>
            <button
              className="status-btn"
              style={{ borderColor: statusColors[task.status] }}
              onClick={() => toggleStatus(task.id)}
            >
              {task.status === "completed" && "✓"}
            </button>
            <div className="task-content">
              <span className="task-title">{task.title}</span>
              <span className={`task-priority ${task.priority}`}>{task.priority}</span>
            </div>
            <span className="task-status" style={{ color: statusColors[task.status] }}>
              {task.status.replace("_", " ")}
            </span>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>×</button>
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
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
}

.page-subtitle {
  color: rgba(255,255,255,0.6);
  margin: 5px 0 0;
}

.add-task-form {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.add-task-form input {
  flex: 1;
  padding: 14px 18px;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  color: white;
  font-size: 14px;
}

.add-task-form button {
  padding: 14px 24px;
  background: #52c41a;
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  opacity: 0.5;
}

.status-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid;
  background: transparent;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.task-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-title {
  font-size: 14px;
}

.task-priority {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  font-weight: 600;
}

.task-priority.high {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.task-priority.medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.task-priority.low {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.task-status {
  font-size: 12px;
  text-transform: capitalize;
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
`;
