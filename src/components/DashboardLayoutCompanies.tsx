// src/components/DashboardLayoutCompanies.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

type DashboardLayoutCompaniesProps = {
  className?: string;
  style?: React.CSSProperties;
  // Slots for widgets (Plasmic drag/drop)
  widget9?: React.ReactNode;  // Top-left (full height)
  widget10?: React.ReactNode; // Bottom-left
  widget11?: React.ReactNode; // Bottom-right
  widget12?: React.ReactNode; // Top-right (full height)
};

export default function DashboardLayoutCompanies({
  className,
  style,
  widget9,
  widget10,
  widget11,
  widget12,
}: DashboardLayoutCompaniesProps) {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "grid",
        gridTemplateAreas: `
          "w9 w12"
          "w10 w11"
        `,
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
      {/* Top-Left: Widget 9 */}
      <div
        style={{
          gridArea: "w9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: 500,
          minHeight: 0, // For flex overflow in Plasmic
        }}
      >
        {widget9}
      </div>

      {/* Top-Right: Widget 12 */}
      <div
        style={{
          gridArea: "w12",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: 500,
          minHeight: 0,
        }}
      >
        {widget12}
      </div>

      {/* Bottom-Left: Widget 10 */}
      <div
        style={{
          gridArea: "w10",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: 500,
          minHeight: 0,
        }}
      >
        {widget10}
      </div>

      {/* Bottom-Right: Widget 11 */}
      <div
        style={{
          gridArea: "w11",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          fontWeight: 500,
          minHeight: 0,
        }}
      >
        {widget11}
      </div>
    </div>
  );
}