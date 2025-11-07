// src/components/WidgetAnalytics.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

export default function WidgetAnalytics() {
  return (
    <div style={{ padding: "1.5rem", background: "#1E293B", borderRadius: 12 }}>
      <h3 style={{ margin: 0, marginBottom: "1rem", color: "#F8FAFC" }}>Analytics</h3>
      <div style={{ height: 120, position: "relative" }}>
        <svg viewBox="0 0 300 120" style={{ width: "100%", height: "100%" }}>
          <path
            d="M0,100 Q50,60 75,80 Q100,50 125,70 Q150,90 175,60 Q200,40 225,70 Q250,90 275,50 Q300,30 300,100"
            fill="none"
            stroke="#0EA5E9"
            strokeWidth="3"
          />
          <path
            d="M0,100 Q50,60 75,80 Q100,50 125,70 Q150,90 175,60 Q200,40 225,70 Q250,90 275,50 Q300,30 300,100 L300,120 L0,120 Z"
            fill="url(#grad)"
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", color: "#94A3B8", fontSize: "0.75rem" }}>
          <span>7 days</span>
          <span>7 days</span>
        </div>
      </div>
    </div>
  );
}