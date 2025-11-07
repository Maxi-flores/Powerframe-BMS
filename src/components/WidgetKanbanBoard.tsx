// src/components/WidgetKanbanBoard.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

type Task = { id: number; title: string; status: "todo" | "inprogress" | "done" };
type WidgetKanbanBoardProps = {
  className?: string;
  style?: React.CSSProperties;
  tasks?: Task[]; // Prop for data
};

const sampleTasks: Task[] = [
  { id: 1, title: "Design mockups", status: "inprogress" },
  { id: 2, title: "Client meeting", status: "todo" },
  { id: 3, title: "Client meeting", status: "done" },
  // Add more from mockup
];

export default function WidgetKanbanBoard({
  className,
  style,
  tasks = sampleTasks,
}: WidgetKanbanBoardProps) {
  const columns = {
    todo: tasks.filter(t => t.status === "todo"),
    inprogress: tasks.filter(t => t.status === "inprogress"),
    done: tasks.filter(t => t.status === "done"),
  };

  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        gap: "1rem",
        padding: "1rem",
        background: "#0F172A",
        borderRadius: "0.5rem",
        overflowX: "auto",
      }}
    >
      {Object.entries(columns).map(([key, colTasks]) => (
        <div key={key} style={{ minWidth: "250px", background: "#1E293B", padding: "1rem", borderRadius: "0.5rem" }}>
          <h3 style={{ marginBottom: "1rem", textAlign: "center", color: key === "done" ? "#10B981" : key === "inprogress" ? "#F59E0B" : "#6B7280" }}>
            {key.toUpperCase()} ({colTasks.length})
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {colTasks.map(task => (
              <li key={task.id} style={{ padding: "0.5rem", background: "#334155", marginBottom: "0.5rem", borderRadius: "0.25rem", cursor: "grab" }}>
                {task.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}