import React, { useState, useEffect, useRef, forwardRef, createContext, useContext } from "react";
import { useDrop } from "react-dnd";
import WidgetRenderer from "./widgets/WidgetRenderer";
import { Widget } from "../types";

interface WidgetSlotProps {
  id: string;
  widget?: Widget;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onRemove: () => void;
}

const WidgetSlot = forwardRef<HTMLDivElement, WidgetSlotProps>(({
  id,
  widget,
  isHovered,
  onHover,
  onRemove,
}, ref) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "WIDGET",
    drop: () => null, // handled in DashboardLayoutHome
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  return (
    <div
      ref={(node) => {
        drop(node);
        if (typeof ref === 'function') ref(node);
      }}
      data-slot-id={id}
      className={`widget-slot ${isOver || isHovered ? "active" : ""} ${widget ? "occupied" : ""}`}
      style={{
        '--row-span': widget?.gridSize?.h || 1,
        '--col-span': widget?.gridSize?.w || 1,
      } as React.CSSProperties}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      {widget && <WidgetRenderer type={widget.type} />}
      {widget && (
        <button onClick={onRemove} className="remove-btn">×</button>
      )}
    </div>
  );
});

export default WidgetSlot;
