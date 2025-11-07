// src/components/NotificationBell.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function NotificationBell({ className, style }: Props) {
  return (
    <div
      className={className}
      style={{
        ...style,
        position: "relative",
      }}
    >
      <span style={{ fontSize: 24 }}>Bell</span>
      <span
        style={{
          position: "absolute",
          top: -6,
          right: -6,
          background: "#EF4444",
          color: "white",
          borderRadius: 12,
          width: 18,
          height: 18,
          fontSize: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        3
      </span>
    </div>
  );
}