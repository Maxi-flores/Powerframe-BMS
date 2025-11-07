import React, { useState, useEffect, useRef, forwardRef, createContext, useContext } from "react";
// src/components/LoginBackground.tsx
type LoginBackgroundProps = {
  className?: string;   // ← NEW: allow Plasmic to add classes
  style?: React.CSSProperties; // ← NEW: allow inline styles
  children?: React.ReactNode;
};

export default function LoginBackground({
  className,
  style,
  children,
}: LoginBackgroundProps) {
  return (
    <div
      className={className}        // ← forward className
      style={{
        ...style,                 // ← merge with inline styles
        position: "fixed",
        inset: 0,
        background: "#0A0E1A",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Blur orbs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, #1E3A8A 0%, transparent 50%),
            radial-gradient(circle at 80% 40%, #2563EB 0%, transparent 50%)
          `,
          filter: "blur(100px)",
          opacity: 0.3,
        }}
      />
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-conic-gradient(#FFFFFF0A 0 90deg, transparent 0 180deg)`,
          backgroundSize: "40px 40px",
          opacity: 0.05,
        }}
      />
      {children}
    </div>
  );
}