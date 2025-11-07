// src/components/WidgetMeetingsActivities.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";
import { Plane, Calendar, User } from "lucide-react"; // Ensure installed: npm i lucide-react

type Activity = { id: number; title: string; desc: string; icon: "plane" | "calendar" | "user"; date: string };
type WidgetMeetingsActivitiesProps = {
  className?: string;
  style?: React.CSSProperties;
  activities?: Activity[]; // Prop for data
};

const sampleActivities: Activity[] = [
  { id: 1, title: "Meeting scheduled with Client X", desc: "Lorem ipsum dolor sit amet...", icon: "plane", date: "Nov 3, 2025" },
  { id: 2, title: "Recent meeting with Client X", desc: "Consectetur adipiscing elit...", icon: "calendar", date: "Oct 30, 2025" },
  { id: 3, title: "Loretem scheduled with Client", desc: "Curae letrices...", icon: "user", date: "Oct 28, 2025" },
  // Expanded from mockup
];

export default function WidgetMeetingsActivities({
  className,
  style,
  activities = sampleActivities,
}: WidgetMeetingsActivitiesProps) {
  const upcoming = activities.filter(a => new Date(a.date) > new Date("2025-11-01"));
  const recent = activities.filter(a => new Date(a.date) <= new Date("2025-11-01"));

  const IconMap = { plane: Plane, calendar: Calendar, user: User };

  return (
    <div
      className={className}
      style={{
        ...style,
        background: "#0F172A",
        padding: "1rem",
        borderRadius: "0.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Upcoming Meetings */}
      <h3 style={{ margin: 0, color: "#F8FAFC" }}>Upcoming Meetings</h3>
      {upcoming.length > 0 ? (
        upcoming.map(a => {
          const IconComponent = IconMap[a.icon]; // Fix: Assign dynamic component here
          return (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", background: "#1E293B", borderRadius: "0.25rem" }}>
              {IconComponent ? <IconComponent size={20} color="#3B82F6" /> : null}
              <div>
                <p style={{ margin: 0, fontWeight: 500 }}>{a.title}</p>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#9CA3AF" }}>{a.desc}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ color: "#9CA3AF", fontStyle: "italic" }}>No upcoming meetings</p>
      )}

      {/* Recent Activities */}
      <h3 style={{ margin: "1rem 0 0 0", color: "#F8FAFC" }}>Recent Activities</h3>
      {recent.length > 0 ? (
        recent.map(a => {
          const IconComponent = IconMap[a.icon]; // Fix: Assign dynamic component here
          return (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", background: "#1E293B", borderRadius: "0.25rem" }}>
              {IconComponent ? <IconComponent size={20} color="#10B981" /> : null}
              <div>
                <p style={{ margin: 0, fontWeight: 500 }}>{a.title}</p>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#9CA3AF" }}>{a.desc}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p style={{ color: "#9CA3AF", fontStyle: "italic" }}>No recent activities</p>
      )}
    </div>
  );
}