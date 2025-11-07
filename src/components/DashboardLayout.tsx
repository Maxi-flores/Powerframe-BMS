import React, { useState, useEffect, useRef, forwardRef, createContext, useContext } from "react";
// src/components/DashboardLayout.tsx
import MagicBento from "./MagicBento";

interface DashboardLayoutProps {
  className?: string;
  style?: React.CSSProperties;

  // Row 1: 4 small metrics
  topMetric1?: React.ReactNode;
  topMetric2?: React.ReactNode;
  topMetric3?: React.ReactNode;
  topMetric4?: React.ReactNode;

  // Row 2: Centered login
  loginEntry?: React.ReactNode;

  // Row 3: 2 large metrics
  bottomMetric1?: React.ReactNode;
  bottomMetric2?: React.ReactNode;

  // Row 4: MagicBento (full width) – fallback to animated hero
  magicBento?: React.ReactNode;

  // Row 5: Two half-width
  halfLeft?: React.ReactNode;
  halfRight?: React.ReactNode;

  // Row 6: Full width
  fullWidth2?: React.ReactNode;
}

export default function DashboardLayout({
  className,
  style,
  topMetric1,
  topMetric2,
  topMetric3,
  topMetric4,
  loginEntry,
  bottomMetric1,
  bottomMetric2,
  magicBento,
  halfLeft,
  halfRight,
  fullWidth2,
}: DashboardLayoutProps) {
  return (
    <div
      className={`dashboard-layout ${className || ""}`}
      style={{
        ...style,
        display: "grid",
        gap: "1.5rem",
        gridTemplateColumns: "repeat(12, 1fr)",
        gridAutoRows: "min-content",
        padding: "1.5rem",
        background: "#0F172A",
        color: "#F8FAFC",
        fontFamily: "Inter, system-ui, sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Row 1: 4 Small Metrics */}
      {topMetric1 && <div style={{ gridColumn: "1 / span 3" }}>{topMetric1}</div>}
      {topMetric2 && <div style={{ gridColumn: "4 / span 3" }}>{topMetric2}</div>}
      {topMetric3 && <div style={{ gridColumn: "7 / span 3" }}>{topMetric3}</div>}
      {topMetric4 && <div style={{ gridColumn: "10 / span 3" }}>{topMetric4}</div>}

      {/* Row 2: Centered Login */}
      {loginEntry && (
        <div
          style={{
            gridColumn: "4 / span 6",
            maxWidth: 420,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {loginEntry}
        </div>
      )}

      {/* Row 3: 2 Large Metrics */}
      {bottomMetric1 && <div style={{ gridColumn: "1 / span 6" }}>{bottomMetric1}</div>}
      {bottomMetric2 && <div style={{ gridColumn: "7 / span 6" }}>{bottomMetric2}</div>}

      {/* Row 4: MagicBento – Full Width Hero */}
      <div style={{ gridColumn: "1 / span 12" }}>
        {magicBento ?? (
          <MagicBento
            
            
            
            
            
            
            
            
            
            glowColor="132, 0, 255"
          />
        )}
      </div>

      {/* Row 5: Two Half-Width Panels */}
      {halfLeft && <div style={{ gridColumn: "1 / span 6" }}>{halfLeft}</div>}
      {halfRight && <div style={{ gridColumn: "7 / span 6" }}>{halfRight}</div>}

      {/* Row 6: Full Width Footer */}
      {fullWidth2 && <div style={{ gridColumn: "1 / span 12" }}>{fullWidth2}</div>}
    </div>
  );
}