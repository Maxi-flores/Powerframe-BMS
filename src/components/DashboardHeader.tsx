// src/components/DashboardHeader.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";
import NotificationBell from "./NotificationBell";
import NewItemButton from "./NewItemButton";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function DashboardHeader({ className, style }: Props) {
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Dashboard</h2>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <NotificationBell />
        <NewItemButton />
      </div>
    </div>
  );
}