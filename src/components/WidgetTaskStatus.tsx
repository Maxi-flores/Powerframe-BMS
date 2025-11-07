// src/components/WidgetTaskStatus.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

export default function WidgetTaskStatus() {
  const data = [
    { label: "In Progress", value: 30, color: "#0EA5E9" },
    { label: "Completed", value: 45, color: "#8B5CF6" },
    { label: "Pending", value: 15, color: "#3B82F6" },
    { label: "Overdue", value: 10, color: "#EF4444" },
  ];

  const total = data.reduce((a, b) => a + b.value, 0);
  let startAngle = 0;

  return (
    <div style={{ padding: "1.5rem", background: "#1E293B", borderRadius: 12 }}>
      <h3 style={{ margin: 0, marginBottom: "1rem", color: "#F8FAFC" }}>Task Status</h3>
      <div style={{ position: "relative", width: "100%", height: 180 }}>
        <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
          {data.map((d, i) => {
            const angle = (d.value / total) * 360;
            const endAngle = startAngle + angle;
            const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
            const largeArc = angle > 180 ? 1 : 0;

            const path = `M100,100 L${x1},${y1} A80,80 0 ${largeArc},1 ${x2},${y2} Z`;
            startAngle = endAngle;

            return <path key={i} d={path} fill={d.color} />;
          })}
          <circle cx="100" cy="100" r="50" fill="#0F172A" />
        </svg>

        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#F8FAFC" }}>45%</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "1rem" }}>
        {data.map((d) => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
            <div style={{ width: 12, height: 12, background: d.color, borderRadius: 6 }} />
            <span style={{ color: "#94A3B8" }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}