import React, { useState, useEffect, useRef, forwardRef, createContext, useContext } from "react";
// src/components/WidgetCalendar.tsx  (COLLAPSIBLE + 6 WEEKS + HORIZONTAL EXPAND)
import "./WidgetCalendar.css";

interface WidgetCalendarProps {
  className?: string;
}

export default function WidgetCalendar({ className }: WidgetCalendarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // NOVEMBER 2025 – 6 weeks
  const firstDayOfMonth = new Date(2025, 10, 1).getDay(); // Mon = 1
  const daysInMonth = 30;
  const totalCells = 42;

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayOffset = i - (firstDayOfMonth - 1);
    const date = dayOffset > 0 && dayOffset <= daysInMonth ? dayOffset : null;

    const events: Record<number, string[]> = {
      3: ["meeting"],
      7: ["youtube", "figma"],
      12: ["smile", "smile"],
      18: ["cloud", "youtube"],
      24: ["task", "task"],
      28: ["youtube", "figma"],
    };

    return {
      date,
      icons: date ? events[date] || [] : [],
    };
  });

  return (
    <div className={`widget-calendar ${className || ""}`}>
      {/* Header with Collapse */}
      <div className="calendar-header">
        <div className="progress-container">
          <ProgressBar title="Project Task" value={55} />
          <ProgressBar title="Priority" value={19} />
          <ProgressBar title="Status" value={10} />
        </div>
        <button
          onClick={() => setIsExpanded((e) => !e)}
          className="collapse-btn"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`arrow ${isExpanded ? "rotated" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* 6-Week Grid – HIDDEN WHEN COLLAPSED */}
      <div className={`calendar-grid-wrapper ${isExpanded ? "expanded" : "collapsed"}`}>
        <div className="calendar-grid-6weeks">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="weekday-label">
              {day}
            </div>
          ))}

          {cells.map((cell, i) => (
            <div key={i} className="calendar-cell">
              {cell.date && (
                <>
                  <span className="date-number">{cell.date}</span>
                  {cell.icons.length > 0 && (
                    <div className="icons-container">
                      {cell.icons.map((icon, idx) => (
                        <div
                          key={idx}
                          className={`icon-badge ${icon === "youtube" ? "yt" : icon === "figma" ? "figma" : "default"}`}
                        >
                          {icon === "youtube" ? "YT" : icon === "figma" ? "F" : icon}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ title, value }: { title: string; value: number }) {
  return (
    <div className="progress-item">
      <div className="progress-header">
        <span className="progress-title">{title}</span>
        <span className="progress-value">{value}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}