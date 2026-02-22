import React, { useState } from "react";
import { useProjects } from "../context/ProjectContext.jsx";

export default function Plans() {
  const { activeProject } = useProjects();
  const [view, setView] = useState("month");

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  // Generate calendar days
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const events = [
    { day: 5, title: "Sprint Planning", color: "#7c3aed" },
    { day: 12, title: "Design Review", color: "#2563eb" },
    { day: 15, title: "Release v1.0", color: "#059669" },
    { day: 22, title: "Team Meeting", color: "#d97706" },
  ];

  return (
    <div className="page-container">
      <style>{css}</style>

      <div className="page-header">
        <div>
          <h1>Plans</h1>
          <p className="page-subtitle">{activeProject?.name} — Calendar & Scheduling</p>
        </div>
        <div className="view-toggle">
          {["week", "month"].map(v => (
            <button
              key={v}
              className={view === v ? "active" : ""}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="calendar-header">
        <button className="nav-btn">←</button>
        <h2>{currentMonth}</h2>
        <button className="nav-btn">→</button>
      </div>

      <div className="calendar">
        <div className="calendar-days">
          {days.map(d => (
            <div key={d} className="day-header">{d}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="day-cell empty" />
          ))}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const isToday = dayNum === currentDate.getDate();
            const dayEvents = events.filter(e => e.day === dayNum);
            return (
              <div key={dayNum} className={`day-cell ${isToday ? "today" : ""}`}>
                <span className="day-num">{dayNum}</span>
                {dayEvents.map((e, idx) => (
                  <div key={idx} className="event" style={{ background: e.color }}>
                    {e.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="upcoming">
        <h3>Upcoming Events</h3>
        {events.map((e, i) => (
          <div key={i} className="upcoming-item">
            <div className="event-dot" style={{ background: e.color }} />
            <span className="event-date">Feb {e.day}</span>
            <span className="event-title">{e.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const css = `
.page-container {
  padding: 30px;
  color: white;
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 28px;
}

.page-subtitle {
  color: rgba(255,255,255,0.6);
  margin: 5px 0 0;
}

.view-toggle {
  display: flex;
  background: rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 4px;
}

.view-toggle button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.6);
  border-radius: 8px;
  cursor: pointer;
  text-transform: capitalize;
}

.view-toggle button.active {
  background: rgba(255,255,255,0.12);
  color: white;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.calendar-header h2 {
  margin: 0;
  font-size: 20px;
  min-width: 200px;
  text-align: center;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.05);
  color: white;
  cursor: pointer;
}

.calendar {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 30px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.day-header {
  text-align: center;
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  padding: 8px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-cell {
  min-height: 80px;
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
  padding: 8px;
}

.day-cell.empty {
  background: transparent;
}

.day-cell.today {
  background: rgba(82, 196, 26, 0.15);
  border: 1px solid rgba(82, 196, 26, 0.4);
}

.day-num {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
}

.event {
  margin-top: 6px;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upcoming {
  background: rgba(255,255,255,0.04);
  border-radius: 14px;
  padding: 20px;
}

.upcoming h3 {
  margin: 0 0 16px;
  font-size: 16px;
}

.upcoming-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.upcoming-item:last-child {
  border-bottom: none;
}

.event-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.event-date {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  min-width: 60px;
}

.event-title {
  font-size: 14px;
}
`;
