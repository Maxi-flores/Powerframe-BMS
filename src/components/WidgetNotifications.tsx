// src/components/WidgetNotifications.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";
import { Bell } from "lucide-react";

type Notification = { id: number; message: string; seen: boolean; date: string };
type WidgetNotificationsProps = {
  className?: string;
  style?: React.CSSProperties;
  notifications?: Notification[]; // Prop for data
};

const sampleNotifications: Notification[] = [
  { id: 1, message: "Meeting scheduled with...", seen: false, date: "Nov 1, 2025" },
  { id: 2, message: "New lead assigned", seen: true, date: "Oct 31, 2025" },
  // From mockup
];

export default function WidgetNotifications({
  className,
  style,
  notifications = sampleNotifications,
}: WidgetNotificationsProps) {
  return (
    <div
      className={className}
      style={{
        ...style,
        background: "#0F172A",
        padding: "1rem",
        borderRadius: "0.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <Bell size={20} color="#F59E0B" />
        <h3 style={{ color: "#F8FAFC", margin: 0 }}>Notifications</h3>
      </div>
      <ul style={{ listStyle: "none", padding: 0, maxHeight: "300px", overflowY: "auto" }}>
        {notifications.map(notif => (
          <li
            key={notif.id}
            style={{
              padding: "0.75rem",
              background: notif.seen ? "#1E293B" : "#334155",
              marginBottom: "0.5rem",
              borderRadius: "0.25rem",
              borderLeft: `3px solid ${notif.seen ? "#6B7280" : "#F59E0B"}`,
            }}
          >
            <p style={{ margin: "0 0 0.25rem 0", fontWeight: notif.seen ? "normal" : "bold" }}>{notif.message}</p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#9CA3AF" }}>{notif.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}