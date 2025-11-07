// src/components/WidgetTaskList.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

type TaskItem = {
  id: number;
  name: string;
  due: string;
  assigned: string;
  status: string;
  priority: "High" | "Medium" | "Low";
};

type WidgetTaskListProps = {
  className?: string;
  style?: React.CSSProperties;
  tasks?: TaskItem[];
  onCreateTask?: () => void;
};

const sampleTasks: TaskItem[] = [
  { id: 1, name: "Design mockups", due: "20/05", assigned: "In Progress", status: "To Do", priority: "High" },
  { id: 2, name: "Client meeting", due: "20/05", assigned: "In Progress", status: "To Do", priority: "Medium" },
  { id: 3, name: "Code review", due: "21/05", assigned: "Alex", status: "In Progress", priority: "High" },
  { id: 4, name: "Deploy to staging", due: "22/05", assigned: "DevOps", status: "To Do", priority: "Low" },
];

const priorityColors: Record<TaskItem["priority"], string> = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "#10B981",
};

export default function WidgetTaskList({
  className,
  style,
  tasks = sampleTasks,
  onCreateTask,
}: WidgetTaskListProps) {
  return (
    <div
      className={className}
      style={{
        ...style,
        background: "#0F172A",
        padding: "1rem",
        borderRadius: "0.5rem",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#F8FAFC",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>Tasks</h3>
        <button
          onClick={onCreateTask}
          style={{
            background: "#3B82F6",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            border: "none",
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2563EB")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#3B82F6")}
        >
          + Create Task
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
          <thead>
            <tr style={{ background: "#1E293B", textAlign: "left", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th style={{ padding: "0.75rem 0.5rem" }}>Task Name</th>
              <th style={{ padding: "0.75rem 0.5rem" }}>Due Date</th>
              <th style={{ padding: "0.75rem 0.5rem" }}>Assigned To</th>
              <th style={{ padding: "0.75rem 0.5rem" }}>Status</th>
              <th style={{ padding: "0.75rem 0.5rem" }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} style={{ borderBottom: "1px solid #334155" }}>
                <td style={{ padding: "0.75rem 0.5rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      style={{
                        accentColor: "#3B82F6",
                        width: "1rem",
                        height: "1rem",
                      }}
                    />
                    <span style={{ fontSize: "0.875rem" }}>{task.name}</span>
                  </label>
                </td>
                <td style={{ padding: "0.75rem 0.5rem", fontSize: "0.875rem", color: "#E2E8F0" }}>{task.due}</td>
                <td style={{ padding: "0.75rem 0.5rem", fontSize: "0.875rem", color: "#E2E8F0" }}>{task.assigned}</td>
                <td style={{ padding: "0.75rem 0.5rem" }}>
                  <span
                    style={{
                      background: task.status === "To Do" ? "#475569" : "#10B981",
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.375rem",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    {task.status}
                  </span>
                </td>
                <td style={{ padding: "0.75rem 0.5rem" }}>
                  <span
                    style={{
                      color: priorityColors[task.priority],
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                  >
                    ● {task.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
          color: "#9CA3AF",
          fontSize: "0.875rem",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            style={{
              background: "transparent",
              border: "none",
              color: "#9CA3AF",
              cursor: "pointer",
              fontSize: "0.875rem",
              padding: "0.25rem 0",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F8FAFC")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
          >
            {"<"} Previous
          </button>
          <button
            style={{
              background: "#3B82F6",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              padding: "0.25rem 0.75rem",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            Play
          </button>
          <button
            style={{
              background: "transparent",
              border: "none",
              color: "#9CA3AF",
              cursor: "pointer",
              fontSize: "0.875rem",
              padding: "0.25rem 0",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F8FAFC")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
          >
            Next {">"}
          </button>
        </div>
        <span style={{ fontSize: "0.875rem" }}>JR +</span>
      </div>
    </div>
  );
}