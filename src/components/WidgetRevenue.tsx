// src/components/WidgetRevenue.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

export default function WidgetRevenue() {
  return (
    <div
      className="widget-revenue"
      style={{
        padding: "1.5rem",
        background: "#1E293B",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          background: "#3B82F6",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "1.25rem",
          fontWeight: "bold",
        }}
      >
        $
      </div>
      <div>
        <div style={{ color: "#94A3B8", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
          Total Revenue
        </div>
        <div style={{ color: "#F8FAFC", fontSize: "1.5rem", fontWeight: "bold" }}>
          $12,345
        </div>
      </div>
    </div>
  );
}