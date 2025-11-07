import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";
export default function WidgetActiveProjects() {
  return (
    <div style={{ padding: "1.5rem", background: "#1E293B", borderRadius: 12, color: "#F8FAFC", display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ width: 48, height: 48, background: "#EF4444", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "bold" }}>F</div>
      <div>
        <div style={{ fontSize: "0.875rem", color: "#94A3B8" }}>Active Projects</div>
        <div style={{ fontSize: "1.75rem", fontWeight: "bold", marginTop: "0.25rem" }}>$12,345</div>
      </div>
    </div>
  );
}
