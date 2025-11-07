// src/components/MetricCard.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  title: string;
  value: string | number;
  change?: string;
};

export default function MetricCard({ className, style, title, value, change }: Props) {
  return (
    <div
      className={className}
      style={{
        ...style,
        background: "#1E293B",
        borderRadius: 12,
        padding: 20,
        minWidth: 180,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: 0, fontSize: 14, color: "#94A3B8" }}>{title}</p>
          <p style={{ margin: "8px 0 0", fontSize: 32, fontWeight: 700, color: "#E2E8F0" }}>
            {value}
          </p>
          {change && (
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#10B981" }}>{change}</p>
          )}
        </div>
        <div style={{ fontSize: 24 }}>Chart</div>
      </div>
    </div>
  );
}