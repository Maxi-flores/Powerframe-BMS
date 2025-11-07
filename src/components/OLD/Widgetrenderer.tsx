// src/components/widgets/WidgetRenderer.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";
import WidgetCalendar from "../WidgetCalendar";

export function WidgetRenderer({ type, data }: { type: string; data?: any }) {
  switch (type) {
    case "calendar":
      return <WidgetCalendar className="widget-content" />;
    default:
      return <div style={{ color: "#94A3B8", textAlign: "center" }}>Widget: {type}</div>;
  }
}
