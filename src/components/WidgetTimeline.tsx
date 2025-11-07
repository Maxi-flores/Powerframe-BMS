// src/components/WidgetTimeline.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

export default function WidgetTimeline() {
  const tasks = [
    { title: "Design Homepage", date: "Today", color: "#0EA5E9" },
    { title: "Write Blog Post", date: "Apr 18", color: "#3B82F6" },
    { title: "Update Documentation", date: "Apr 20", color: "#8B5CF6" },
    { title: "Fix Login Issue", date: "Apr 22", color: "#EF4444" },
  ];

  return (
    <div style={{ padding: "1.5rem", background: "#1E293B", borderRadius: 12 }}>
      <h3 style={{ margin: 0, marginBottom: "1rem", color: "#F8FAFC" }}>Timeline</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {tasks.map((task, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 12, height: 12, background: task.color, borderRadius: "50%" }} />
            <div style={{ flex: 1, color: "#F8FAFC" }}>{task.title}</div>
            <div style={{ color: "#94A3B8", fontSize: "0.875rem" }}>{task.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}