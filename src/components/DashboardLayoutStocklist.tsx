import React, { useState, useEffect, useRef, forwardRef, createContext, useContext } from "react";
// src/components/DashboardLayoutStocklist.tsx
type DashboardLayoutStocklistProps = {
  className?: string;
  style?: React.CSSProperties;
  // Slots for widgets (Plasmic drag/drop)
  widget13?: React.ReactNode;  // Row 1: Left 8-col (wide)
  widget14?: React.ReactNode;  // Row 1: Right 4-col
  widget15?: React.ReactNode;  // Row 2: Right 4-col (stacked under 14)
  widget16?: React.ReactNode;  // Row 3: Left 6-col
  widget17?: React.ReactNode;  // Row 3: Right 6-col
  widget18?: React.ReactNode;  // Row 4: Left 6-col
  widget19?: React.ReactNode;  // Row 5: Left 9-col (wide)
  widget20?: React.ReactNode;  // Row 5: Right 3-col
};

export default function DashboardLayoutStocklist({
  className,
  style,
  widget13,
  widget14,
  widget15,
  widget16,
  widget17,
  widget18,
  widget19,
  widget20,
}: DashboardLayoutStocklistProps) {
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
      {/* Row 1: 8 + 4 cols */}
      <div style={{ gridColumn: "1 / span 8", minHeight: "200px" }}>
        {widget13}
      </div>
      <div style={{ gridColumn: "9 / span 4", minHeight: "200px" }}>
        {widget14}
      </div>

      {/* Row 2: Right 4-col only (under widget14) */}
      <div style={{ gridColumn: "9 / span 4", minHeight: "200px" }}>
        {widget15}
      </div>

      {/* Row 3: 6 + 6 cols */}
      <div style={{ gridColumn: "1 / span 6", minHeight: "200px" }}>
        {widget16}
      </div>
      <div style={{ gridColumn: "7 / span 6", minHeight: "200px" }}>
        {widget17}
      </div>

      {/* Row 4: Left 6-col only */}
      <div style={{ gridColumn: "1 / span 6", minHeight: "200px" }}>
        {widget18}
      </div>

      {/* Row 5: 9 + 3 cols */}
      <div style={{ gridColumn: "1 / span 9", minHeight: "200px" }}>
        {widget19}
      </div>
      <div style={{ gridColumn: "10 / span 3", minHeight: "200px" }}>
        {widget20}
      </div>
    </main>
  );
}