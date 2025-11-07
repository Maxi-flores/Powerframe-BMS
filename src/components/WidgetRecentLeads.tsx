// src/components/WidgetRecentLeads.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

type Lead = { id: number; name: string; company: string; stage: string; date: string; status: string };
type WidgetRecentLeadsProps = {
  className?: string;
  style?: React.CSSProperties;
  leads?: Lead[]; // Prop for data
};

const sampleLeads: Lead[] = [
  { id: 1, name: "Lead 1", company: "Company A", stage: "New", date: "Oct 3", status: "Open" },
  { id: 2, name: "Lead 2", company: "Company A", stage: "New", date: "Oct 3", status: "Qualified" },
  // From mockup
];

export default function WidgetRecentLeads({
  className,
  style,
  leads = sampleLeads,
}: WidgetRecentLeadsProps) {
  return (
    <div
      className={className}
      style={{
        ...style,
        background: "#0F172A",
        padding: "1rem",
        borderRadius: "0.5rem",
        overflowX: "auto",
      }}
    >
      <h3 style={{ margin: "0 0 1rem 0", color: "#F8FAFC" }}>Recent Leads</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", color: "#F8FAFC" }}>
        <thead>
          <tr style={{ background: "#1E293B" }}>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Lead</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Company</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Stage</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Date</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Status</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Last Contact</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id} style={{ borderBottom: "1px solid #334155" }}>
              <td style={{ padding: "0.5rem" }}>{lead.name}</td>
              <td style={{ padding: "0.5rem" }}>{lead.company}</td>
              <td style={{ padding: "0.5rem" }}>{lead.stage}</td>
              <td style={{ padding: "0.5rem" }}>{lead.date}</td>
              <td style={{ padding: "0.5rem" }}>{lead.status}</td>
              <td style={{ padding: "0.5rem" }}>
                <div style={{ display: "flex", gap: "0.25rem", height: "0.5rem", background: "#334155", borderRadius: "0.25rem", overflow: "hidden" }}>
                  <div style={{ width: "50%", background: "#3B82F6" }} /> {/* Blue bar */}
                  <div style={{ width: "30%", background: "#EF4444" }} /> {/* Red bar */}
                  <div style={{ width: "20%", background: "#10B981" }} /> {/* Green bar */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}