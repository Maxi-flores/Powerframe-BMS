import React, { useState } from "react";
import { useProjects } from "../context/ProjectContext.jsx";

export default function Out() {
  const { activeProject } = useProjects();
  const [messages, setMessages] = useState([
    { id: 1, to: "team@company.com", subject: "Weekly Update", status: "sent", date: "2026-02-20" },
    { id: 2, to: "client@example.com", subject: "Project Proposal", status: "sent", date: "2026-02-19" },
    { id: 3, to: "dev@team.io", subject: "API Documentation", status: "draft", date: "2026-02-22" },
  ]);

  const [composing, setComposing] = useState(false);
  const [newMessage, setNewMessage] = useState({ to: "", subject: "", body: "" });

  function sendMessage(e) {
    e.preventDefault();
    if (!newMessage.to || !newMessage.subject) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      ...newMessage,
      status: "sent",
      date: new Date().toISOString().split("T")[0]
    }]);
    setNewMessage({ to: "", subject: "", body: "" });
    setComposing(false);
  }

  return (
    <div className="page-container">
      <style>{css}</style>

      <div className="page-header">
        <div>
          <h1>Outbox</h1>
          <p className="page-subtitle">{activeProject?.name} — Sent messages & drafts</p>
        </div>
        <button className="btn-primary" onClick={() => setComposing(true)}>
          + Compose
        </button>
      </div>

      <div className="messages-list">
        {messages.map(msg => (
          <div key={msg.id} className="message-item">
            <div className={`status-dot ${msg.status}`} />
            <div className="message-info">
              <span className="message-to">{msg.to}</span>
              <span className="message-subject">{msg.subject}</span>
            </div>
            <span className="message-date">{msg.date}</span>
            <span className={`message-status ${msg.status}`}>{msg.status}</span>
          </div>
        ))}
      </div>

      {composing && (
        <div className="modal-overlay" onClick={() => setComposing(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Compose Message</h2>
            <form onSubmit={sendMessage}>
              <label>To</label>
              <input
                type="email"
                value={newMessage.to}
                onChange={e => setNewMessage(m => ({ ...m, to: e.target.value }))}
                placeholder="recipient@example.com"
              />

              <label>Subject</label>
              <input
                type="text"
                value={newMessage.subject}
                onChange={e => setNewMessage(m => ({ ...m, subject: e.target.value }))}
                placeholder="Message subject"
              />

              <label>Body</label>
              <textarea
                value={newMessage.body}
                onChange={e => setNewMessage(m => ({ ...m, body: e.target.value }))}
                placeholder="Write your message..."
                rows={6}
              />

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setComposing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

.btn-primary {
  padding: 12px 24px;
  background: #52c41a;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary {
  padding: 12px 24px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  color: white;
  cursor: pointer;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot.sent { background: #22c55e; }
.status-dot.draft { background: #f59e0b; }

.message-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-to {
  font-size: 14px;
  font-weight: 500;
}

.message-subject {
  font-size: 13px;
  color: rgba(255,255,255,0.6);
}

.message-date {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
}

.message-status {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 6px;
  text-transform: uppercase;
  font-weight: 600;
}

.message-status.sent {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.message-status.draft {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: linear-gradient(180deg, #1e1e2e, #15151f);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  padding: 30px;
  width: 500px;
  max-width: 90vw;
}

.modal h2 { margin: 0 0 24px; font-size: 20px; }

.modal label {
  display: block;
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  margin-bottom: 8px;
}

.modal input, .modal textarea {
  width: 100%;
  padding: 12px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  color: white;
  margin-bottom: 20px;
  font-family: inherit;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
`;
