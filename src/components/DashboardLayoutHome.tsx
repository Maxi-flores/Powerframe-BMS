import React, { useState, useEffect, useRef, forwardRef, createContext, useContext } from "react";
// src/components/DashboardLayoutHome.tsx
import { useDrop } from "react-dnd";
import WidgetSlot from "./WidgetSlot";
import DraggableWidget from "./DraggableWidget";
import { useLayoutStore } from "../store/layoutStore";
import { WidgetType } from "../types";
import "./DashboardLayoutHome.css";

const ROWS = 3; // ← FIXED: Reduced to 3 rows
const COLS = 4; // ← 3×4 grid = 12 slots max

interface SlotConfig {
  id: string;
}

const WIDGET_SLOTS: SlotConfig[] = Array.from({ length: ROWS * COLS }, (_, i) => ({
  id: `slot${i + 1}`,
}));

const WIDGET_PALETTE: WidgetType[] = [
  "kanban",
  "chart",
  "metrics",
  "tasks",
  "calendar",
  "revenue" as WidgetType,
  "timeline" as WidgetType,
  "notifications" as WidgetType,
  "active-projects" as WidgetType,
];

interface DashboardLayoutHomeProps {
  className?: string;
}

export default function DashboardLayoutHome({ className }: DashboardLayoutHomeProps) {
  const { layout, addWidget, moveWidget, removeWidget } = useLayoutStore();
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [showPalette, setShowPalette] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(() => ({
    accept: "WIDGET",
    drop: (item: { type: WidgetType; id?: string; gridSize?: { w: number; h: number } }, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || !dropRef.current) return;

      const dropTarget = document.elementFromPoint(offset.x, offset.y);
      const slotElement = dropTarget?.closest("[data-slot-id]");
      const slotId = slotElement?.getAttribute("data-slot-id");

      if (slotId) {
        const size = item.gridSize || { w: 1, h: 1 };
        if (item.id) {
          moveWidget(item.id, slotId, size);
        } else {
          addWidget(item.type, slotId, size);
        }
      }
    },
  }));

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`dashboard-layout-home ${className || ""}`}
      data-plasmic-name="DashboardLayoutHome"
      data-plasmic-id="dashboard-layout-home"
    >
      {/* DARK COSMOS BACKGROUND */}
      <div className="dashboard-bg" />

      {/* 3×4 FIXED GRID WITH MERGE SUPPORT */}
      <div className="dashboard-grid">
        {WIDGET_SLOTS.map((slot) => (
          <WidgetSlot
            key={slot.id}
            id={slot.id}
            widget={layout[slot.id]}
            isHovered={hoveredSlot === slot.id}
            onHover={setHoveredSlot}
            onRemove={() => removeWidget(slot.id)}
          />
        ))}
      </div>

      {/* ENLARGED FAB + SCROLLABLE PALETTE */}
      <div className="fab-container">
        <button
          onClick={() => setShowPalette((p) => !p)}
          className="fab-button"
          aria-label="Add widget"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className={`fab-icon ${showPalette ? "rotate" : ""}`}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>

        {showPalette && (
          <div className="widget-palette">
            <div className="palette-title">Add Widget</div>
            <div className="palette-scroll">
              {WIDGET_PALETTE.map((type) => (
                <DraggableWidget
                  key={type}
                  type={type}
                  gridSize={
                    type === "calendar" || type === "kanban" ? { w: 2, h: 2 } :
                    type === "revenue" as WidgetType ? { w: 3, h: 2 } : { w: 1, h: 1 }
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}