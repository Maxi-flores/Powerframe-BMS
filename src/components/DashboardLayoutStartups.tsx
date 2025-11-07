// src/components/DashboardLayoutStartups.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

type DashboardLayoutStartupsProps = {
  className?: string;
  style?: React.CSSProperties;
  // Slots for widgets (Plasmic drag/drop)
  widget24?: React.ReactNode;  // Left half
  widget25?: React.ReactNode;  // Right half
};

export default function DashboardLayoutStartups({
  className,
  style,
  widget24,
  widget25,
}: DashboardLayoutStartupsProps) {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.5rem",
        padding: "1.5rem",
        height: "calc(100vh - 80px)", // Adjust for header
        background: "#0F172A", // Dark theme
        color: "#F8FAFC",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Left: Widget 24 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: 500,
          minHeight: 0, // For flex overflow in Plasmic
        }}
      >
        {widget24}
      </div>

      {/* Right: Widget 25 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: 500,
          minHeight: 0,
        }}
      >
        {widget25}
      </div>
    </div>
  );
}