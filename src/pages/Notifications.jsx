import React, { useState, useEffect } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "info", title: "Welcome to PowerFrame", message: "Get started by creating your first project", time: "Just now", read: false },
    { id: 2, type: "success", title: "Task Completed", message: "User authentication implementation finished", time: "2 hours ago", read: false },
    { id: 3, type: "warning", title: "Storage Warning", message: "You're approaching your storage limit", time: "5 hours ago", read: true },
    { id: 4, type: "info", title: "New Feature", message: "Check out the new calendar view in Plans", time: "1 day ago", read: true },
  ]);

  // Capture TRT_BRIDGE_LAB_CANDIDATE postMessage events as ephemeral alerts
  useEffect(() => {
    function handleBridgeMessage(event) {
      const { type, unityActionCandidate, runtimeStatus } = event.data || {};
      if (type !== "TRT_BRIDGE_LAB_CANDIDATE") return;

      const bridgeAlert = {
        id: `bridge-${Date.now()}`,
        type: "bridge",
        title: "System Test / Bridge Lab",
        message: unityActionCandidate?.label
          ? `[${runtimeStatus?.meaning || "event"}] ${unityActionCandidate.label}`
          : `Bridge event: ${runtimeStatus?.meaning || "received"}`,
        time: "Just now",
        read: false,
        volatile: true,
      };

      setNotifications(prev => [bridgeAlert, ...prev]);
    }

    window.addEventListener("message", handleBridgeMessage);
    return () => window.removeEventListener("message", handleBridgeMessage);
  }, []);

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function deleteNotification(id) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  function toggleRead(id) {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    ));
  }

  const typeIcons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
    bridge: "⚡",
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="page-container">
      <style>{css}</style>

      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="page-subtitle">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn-secondary" onClick={markAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔔</span>
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`notification-item ${n.read ? "read" : ""}`}>
              <span className="notif-icon">{typeIcons[n.type]}</span>
              <div className="notif-content" onClick={() => toggleRead(n.id)}>
                <div className="notif-header">
                  <strong>{n.title}</strong>
                  {!n.read && <span className="unread-dot" />}
                </div>
                <p className="notif-message">{n.message}</p>
                <span className="notif-time">{n.time}</span>
              </div>
              <button className="delete-btn" onClick={() => deleteNotification(n.id)}>×</button>
            </div>
          ))
        )}
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

.page-header h1 { margin: 0; font-size: 28px; }
.page-subtitle { color: rgba(255,255,255,0.6); margin: 5px 0 0; }

.btn-secondary {
  padding: 10px 20px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  color: white;
  cursor: pointer;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  cursor: pointer;
}

.notification-item.read {
  opacity: 0.6;
  background: rgba(255,255,255,0.03);
}

.notif-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.notif-content {
  flex: 1;
}

.notif-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.notif-header strong {
  font-size: 15px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
}

.notif-message {
  margin: 6px 0;
  font-size: 13px;
  color: rgba(255,255,255,0.7);
}

.notif-time {
  font-size: 11px;
  color: rgba(255,255,255,0.4);
}

.delete-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  font-size: 18px;
  flex-shrink: 0;
}

.delete-btn:hover {
  background: #dc2626;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: rgba(255,255,255,0.4);
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}
`;
