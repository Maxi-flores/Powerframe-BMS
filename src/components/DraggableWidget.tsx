import React from "react";
import { useDrag } from "react-dnd";
import { WidgetType } from "../types";

interface DraggableWidgetProps {
  type: WidgetType;
  gridSize?: { w: number; h: number };
}

export default function DraggableWidget({ type, gridSize }: DraggableWidgetProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "WIDGET",
    item: { type, gridSize },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  const previews: Record<WidgetType, string> = {
    calendar: "📅 Calendar",
    kanban: "📋 Kanban",
    revenue: "📈 Revenue XL",
    // add more
  };

  return (
    <div
      ref={drag}
      className="draggable-widget-preview"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {previews[type] || type}
    </div>
  );
}
