import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";
export default function WidgetNewCustomers() {
  return (
    <div style={{ padding: "1.5rem", background: "#1E293B", borderRadius: 12, color: "#F8FAFC" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{ width: 48, height: 48, background: "#0EA5E9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>Star</div>
        <div style={{ fontSize: "0.875rem", color: "#94A3B8" }}>New Customers</div>
      </div>
      <div style={{ height: 4, background: "linear-gradient(90deg, #0EA5E9 0%, #3B82F6 50%, transparent 100%)", borderRadius: 2 }} />
    </div>
  );
}
