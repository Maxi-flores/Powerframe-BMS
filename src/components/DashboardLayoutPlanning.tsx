import React, { useState, useEffect, useRef, forwardRef, createContext, useContext } from "react";
// src/components/DashboardLayoutPlanning.tsx
type DashboardLayoutPlanningProps = {
  className?: string;
  style?: React.CSSProperties;
  // Slots for widgets (Plasmic drag/drop)
  widget21?: React.ReactNode;  // Row 1: Left 3-col
  widget22?: React.ReactNode;  // Row 1: Mid 3-col
  widget23?: React.ReactNode;  // Row 1: Right 6-col (wide)
  widget24?: React.ReactNode;  // Row 2: Left 6-col
  widget25?: React.ReactNode;  // Row 2: Right 6-col
  widget26?: React.ReactNode;  // Row 3: Left 6-col
  widget27?: React.ReactNode;  // Row 3: Right 6-col
  widget28?: React.ReactNode;  // Row 4: Left 9-col (wide)
  widget29?: React.ReactNode;  // Row 4: Right 3-col
  widget30?: React.ReactNode;  // Row 5: Full 9-col (bottom)
};

export default function DashboardLayoutPlanning({
  className,
  style,
  widget21,
  widget22,
  widget23,
  widget24,
  widget25,
  widget26,
  widget27,
  widget28,
  widget29,
  widget30,
}: DashboardLayoutPlanningProps) {
  return (
    <main
      className={className}
      style={{
        ...style,
        display: "grid",
        gap: "1.5rem",
        gridTemplateColumns: "repeat(12, 1fr)",
        padding: "1.5rem",
        background: "#0F172A", // Dark theme
        color: "#F8FAFC",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Row 1: 3 + 3 + 6 cols */}
      <div style={{ gridColumn: "1 / span 3", minHeight: "200px" }}> {/* Drop zone */}
        {widget21}
      </div>
      <div style={{ gridColumn: "4 / span 3", minHeight: "200px" }}>
        {widget22}
      </div>
      <div style={{ gridColumn: "7 / span 6", minHeight: "200px" }}>
        {widget23}
      </div>

      {/* Row 2: 6 + 6 cols */}
      <div style={{ gridColumn: "1 / span 6", minHeight: "200px" }}>
        {widget24}
      </div>
      <div style={{ gridColumn: "7 / span 6", minHeight: "200px" }}>
        {widget25}
      </div>

      {/* Row 3: 6 + 6 cols */}
      <div style={{ gridColumn: "1 / span 6", minHeight: "200px" }}>
        {widget26}
      </div>
      <div style={{ gridColumn: "7 / span 6", minHeight: "200px" }}>
        {widget27}
      </div>

      {/* Row 4: 9 + 3 cols */}
      <div style={{ gridColumn: "1 / span 9", minHeight: "200px" }}>
        {widget28}
      </div>
      <div style={{ gridColumn: "10 / span 3", minHeight: "200px" }}>
        {widget29}
      </div>

      {/* Row 5: Full 9-col (bottom) */}
      <div style={{ gridColumn: "1 / span 9", minHeight: "200px" }}>
        {widget30}
      </div>
    </main>
  );
}