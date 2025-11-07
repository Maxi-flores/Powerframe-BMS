export type WidgetType = 
  | "kanban"
  | "chart"
  | "metrics"
  | "tasks"
  | "calendar"
  | "revenue"
  | "timeline"
  | "notifications"
  | "active-projects";

export interface Widget {
  type: WidgetType;
  id: string;
  gridSize?: { w: number; h: number };
}
