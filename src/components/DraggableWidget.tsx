import React from "react";
import { useDrag } from "react-dnd";
import { WidgetType } from "../types";

interface DraggableWidgetProps {
  type: WidgetType;
  gridSize?: { w: number; h: number };
}

const previews: Record<WidgetType, string> = {
  "kanban": "📋 Kanban",
  "chart": "📊 Chart",
  "metrics": "📈 Metrics",
  "tasks": "✅ Tasks",
  "calendar": "📅 Calendar",
  "revenue": "💰 Revenue XL",
  "timeline": "⏰ Timeline",
  "notifications": "🔔 Notifications",
  "active-projects": "🚀 Projects",
} as const;

export default function DraggableWidget({ type, gridSize }: DraggableWidgetProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "WIDGET",
    item: { type, gridSize },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} className="draggable-preview">
      {previews[type]}
    </div>
  );
}
