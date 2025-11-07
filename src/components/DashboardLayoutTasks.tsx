import React, { useState, useEffect, useRef, forwardRef, createContext, useContext } from "react";
// src/components/DashboardLayoutTasks.tsx
type Props = {
  widget31?: React.ReactNode;
  widget32?: React.ReactNode;
  widget33?: React.ReactNode;
  widget34?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function DashboardLayoutTasks({
  widget31,
  widget32,
  widget33,
  widget34,
  className,
  style,
}: Props) {
  return (
    <main
      className={className}
      style={{
        ...style,
        display: "grid",
        gap: "1.5rem",
        gridTemplateColumns: "repeat(12, 1fr)",
        gridAutoRows: "minmax(100px, auto)",
        padding: "1.5rem",
        background: "#0F172A",
        color: "#F8FAFC",
        fontFamily: "Inter, system-ui, sans-serif",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Widget 31: 9-col wide */}
      <div
        style={{
          gridColumn: "1 / span 9",
          gridRow: "1",
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "2px dashed rgba(59, 130, 246, 0.3)",
          transition: "all 0.2s ease",
          minHeight: "200px",
        }}
      >
        {widget31 ? (
          widget31
        ) : (
          <div
            style={{
              color: "#64748B",
              fontSize: "1.125rem",
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Widget 31
            <br />
            <span style={{ fontSize: "0.875rem", color: "#94A3B8" }}>
              9-column wide
            </span>
          </div>
        )}
      </div>

      {/* Widget 32: 3-col narrow */}
      <div
        style={{
          gridColumn: "10 / span 3",
          gridRow: "1",
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "2px dashed rgba(34, 197, 94, 0.3)",
          transition: "all 0.2s ease",
          minHeight: "200px",
        }}
      >
        {widget32 ? (
          widget32
        ) : (
          <div
            style={{
              color: "#64748B",
              fontSize: "1.125rem",
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Widget 32
            <br />
            <span style={{ fontSize: "0.875rem", color: "#94A3B8" }}>
              3-column narrow
            </span>
          </div>
        )}
      </div>

      {/* Widget 33: 9-col wide */}
      <div
        style={{
          gridColumn: "1 / span 9",
          gridRow: "2",
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "2px dashed rgba(168, 85, 247, 0.3)",
          transition: "all 0.2s ease",
          minHeight: "250px",
        }}
      >
        {widget33 ? (
          widget33
        ) : (
          <div
            style={{
              color: "#64748B",
              fontSize: "1.125rem",
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Widget 33
            <br />
            <span style={{ fontSize: "0.875rem", color: "#94A3B8" }}>
              9-column wide
            </span>
          </div>
        )}
      </div>

      {/* Widget 34: Full width */}
      <div
        style={{
          gridColumn: "1 / span 12",
          gridRow: "3",
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "2px dashed rgba(251, 146, 60, 0.3)",
          transition: "all 0.2s ease",
          minHeight: "300px",
        }}
      >
        {widget34 ? (
          widget34
        ) : (
          <div
            style={{
              color: "#64748B",
              fontSize: "1.125rem",
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Widget 34
            <br />
            <span style={{ fontSize: "0.875rem", color: "#94A3B8" }}>
              Full width (12 columns)
            </span>
          </div>
        )}
      </div>
    </main>
  );
}