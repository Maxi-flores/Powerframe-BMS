// src/components/DashboardLayoutTargets.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

type DashboardLayoutTargetsProps = {
  className?: string;
  style?: React.CSSProperties;
  // Slots for widgets (Plasmic drag/drop)
  widget35?: React.ReactNode;  // Top-Left
  widget36?: React.ReactNode;  // Top-Right
  widget37?: React.ReactNode;  // Bottom-Left
  widget38?: React.ReactNode;  // Bottom-Right
};

export default function DashboardLayoutTargets({
  className,
  style,
  widget35,
  widget36,
  widget37,
  widget38,
}: DashboardLayoutTargetsProps) {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: "1.5rem",
        padding: "1.5rem",
        height: "calc(100vh - 80px)", // Adjust for header
        background: "#0F172A", // Dark theme
        color: "#F8FAFC",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Top-Left: Widget 35 */}
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
        {widget35}
      </div>

      {/* Top-Right: Widget 36 */}
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
        {widget36}
      </div>

      {/* Bottom-Left: Widget 37 */}
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
        {widget37}
      </div>

      {/* Bottom-Right: Widget 38 */}
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
        {widget38}
      </div>
    </div>
  );
}