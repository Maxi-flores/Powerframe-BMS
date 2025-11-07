// src/components/BottomMetricCard.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  label: string;
  value: string | number;
  icon?: string;
};

export default function BottomMetricCard({
  className,
  style,
  label,
  value,
  icon = "Dollar",
}: Props) {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "#1E293B",
        borderRadius: 12,
        padding: 16,
        flex: 1,
        minWidth: 200,
      }}
    >
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div>
        <p style={{ margin: 0, fontSize: 14, color: "#94A3B8" }}>{label}</p>
        <p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 700, color: "#E2E8F0" }}>
          {value}
        </p>
      </div>
    </div>
  );
}