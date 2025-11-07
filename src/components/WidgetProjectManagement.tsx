// src/components/WidgetProjectManagement.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

type Project = { id: number; name: string; status: string; deadline: string; variants: string; sales: number };
type WidgetProjectManagementProps = {
  className?: string;
  style?: React.CSSProperties;
  projects?: Project[]; // Prop for data
};

const sampleProjects: Project[] = [
  { id: 1, name: "E-commerce Platform", status: "In Progress", deadline: "2 days", variants: "Current", sales: 800 },
  { id: 2, name: "Marketing Campaign", status: "Completed", deadline: "3 days", variants: "Current", sales: 600 },
  // From mockup
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const barData = [200, 300, 250, 400, 350, 450, 300, 500]; // Sample

export default function WidgetProjectManagement({
  className,
  style,
  projects = sampleProjects,
}: WidgetProjectManagementProps) {
  return (
    <div
      className={className}
      style={{
        ...style,
        background: "#0F172A",
        padding: "1rem",
        borderRadius: "0.5rem",
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      {/* Bar Chart */}
      <div>
        <h4 style={{ color: "#F8FAFC", marginBottom: "1rem" }}>Project Management</h4>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "end", height: "200px" }}>
          {barData.map((val, i) => (
            <div key={i} style={{ flex: 1, background: "#3B82F6", height: `${(val / 500) * 100}%`, borderRadius: "0.25rem" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#9CA3AF", mt: "0.5rem" }}>
          {months.map(m => <span key={m}>{m}</span>)}
        </div>
      </div>

      {/* Pie Chart (SVG) + Metrics */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ color: "#F8FAFC" }}>Total Sales</h4>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="25" fill="none" stroke="#10B981" strokeWidth="5" strokeDasharray="78.5 157" strokeDashoffset="78.5" />
            <text x="30" y="35" textAnchor="middle" fill="#F8FAFC" fontSize="12">25%</text>
          </svg>
        </div>
        <p style={{ color: "#9CA3AF" }}>Conversion Rate</p>
      </div>

      {/* Projects Table (full width below) */}
      <div style={{ gridColumn: "1 / -1" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "#F8FAFC" }}>
          <thead style={{ background: "#1E293B" }}>
            <tr>
              <th style={{ padding: "0.5rem" }}>Project Name</th>
              <th style={{ padding: "0.5rem" }}>Status</th>
              <th style={{ padding: "0.5rem" }}>Deadline</th>
              <th style={{ padding: "0.5rem" }}>Variants</th>
              <th style={{ padding: "0.5rem" }}>Sales</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid #334155" }}>
                <td style={{ padding: "0.5rem" }}>{p.name}</td>
                <td style={{ padding: "0.5rem" }}>{p.status}</td>
                <td style={{ padding: "0.5rem" }}>{p.deadline}</td>
                <td style={{ padding: "0.5rem" }}>{p.variants}</td>
                <td style={{ padding: "0.5rem" }}>${p.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}