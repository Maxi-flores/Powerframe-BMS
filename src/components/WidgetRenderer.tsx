// src/components/Widgets/WidgetRenderer.tsx
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import "./WidgetRenderer.css";

type WidgetRendererProps = {
  type: string;
};

export default function WidgetRenderer({ type }: WidgetRendererProps) {
  const today = new Date(); // November 06, 2025
  const currentMonth = format(today, "MMMM yyyy");
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const days = eachDayOfInterval({ start, end });
  const startDayOffset = getDay(start); // 0 = Sun, 6 = Sat

  switch (type) {
    case "calendar":
      return (
        <div className="widget-calendar">
          <div className="cal-header">
            <button disabled>‹</button>
            <h3>{currentMonth}</h3>
            <button disabled>›</button>
          </div>
          <div className="cal-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="cal-days">
            {/* Empty slots before month start */}
            {Array(startDayOffset)
              .fill(null)
              .map((_, i) => (
                <div key={`empty-${i}`} className="cal-day empty" />
              ))}

            {/* Actual days */}
            {days.map((day) => {
              const dayNum = day.getDate();
              const isToday = dayNum === 6 && day.getMonth() === 10 && day.getFullYear() === 2025;
              return (
                <div
                  key={dayNum}
                  className={`cal-day active ${isToday ? "today" : ""}`}
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Fill remaining grid */}
            {Array(35 - startDayOffset - days.length)
              .fill(null)
              .map((_, i) => (
                <div key={`fill-${i}`} className="cal-day empty" />
              ))}
          </div>
        </div>
      );

    case "large-chart":
      return (
        <div className="widget-revenue">
          <h3>Revenue Overview</h3>
          <div className="chart-placeholder">
            <div className="bar" style={{ height: "60%" }}>$48.2k</div>
            <div className="bar" style={{ height: "75%" }}>$62.1k</div>
            <div className="bar" style={{ height: "90%" }}>$78.5k</div>
            <div className="bar" style={{ height: "70%" }}>$58.3k</div>
            <div className="bar" style={{ height: "95%" }}>$92.7k</div>
          </div>
          <p>+24% from last month</p>
        </div>
      );

    case "metric":
      return (
        <div className="widget-metric">
          <h3>Tasks Today</h3>
          <div className="metric-value">24</div>
          <p>8 completed • 16 pending</p>
        </div>
      );

    case "deals":
      return (
        <div className="widget-metric">
          <h3>Active Deals</h3>
          <div className="metric-value">$248,500</div>
          <p>12 deals in pipeline</p>
        </div>
      );

    case "kanban":
      return (
        <div className="widget-kanban">
          <div className="kanban-columns">
            <div className="column">
              <h4>To Do (5)</h4>
              <div className="card">Design Mockups</div>
              <div className="card">API Integration</div>
              <div className="card">User Testing</div>
            </div>
            <div className="column">
              <h4>In Progress (3)</h4>
              <div className="card">Frontend Build</div>
              <div className="card">Backend API</div>
            </div>
            <div className="column">
              <h4>Done (8)</h4>
              <div className="card">Login System</div>
              <div className="card">Dashboard v1</div>
            </div>
          </div>
        </div>
      );

    case "table":
      return (
        <div className="widget-table">
          <h3>Recent Activity</h3>
          <table>
            <tbody>
              <tr><td>John Doe</td><td>Closed Deal</td><td>2h ago</td></tr>
              <tr><td>Jane Smith</td><td>New Lead</td><td>4h ago</td></tr>
              <tr><td>Mike Johnson</td><td>Task Completed</td><td>6h ago</td></tr>
              <tr><td>Sara Lee</td><td>Meeting Scheduled</td><td>8h ago</td></tr>
            </tbody>
          </table>
        </div>
      );

    default:
      return <div className="widget-empty">Unknown Widget: {type}</div>;
  }
}