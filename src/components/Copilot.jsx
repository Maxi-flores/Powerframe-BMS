import React, { useState, useRef, useEffect } from "react";

export default function Copilot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your Knowledge Base Copilot. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const responses = [
        "I found some relevant information in the knowledge base. Let me summarize it for you...",
        "Based on your query, here are the key points from our documentation...",
        "I can help you with that! Here's what I found in the system...",
        "Let me search through the knowledge base for you...",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: "assistant", content: randomResponse }]);
      setIsTyping(false);
    }, 1500);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      <style>{copilotCSS}</style>

      {/* Backdrop */}
      <div
        className={`copilot-backdrop ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      />

      {/* Chat Panel */}
      <div className={`copilot-panel ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="copilot-header">
          <div className="copilot-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
              <circle cx="12" cy="17" r="3" />
              <path d="M12 14v-2" />
            </svg>
          </div>
          <div className="copilot-header-info">
            <h3>Knowledge Copilot</h3>
            <span className="copilot-status">
              <span className="status-dot" />
              Online
            </span>
          </div>
          <button className="copilot-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="copilot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`copilot-message ${msg.role}`}>
              {msg.role === "assistant" && (
                <div className="message-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                  </svg>
                </div>
              )}
              <div className="message-bubble">
                <p>{msg.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="copilot-message assistant">
              <div className="message-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                </svg>
              </div>
              <div className="message-bubble typing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="copilot-quick-actions">
          <button onClick={() => setInput("Show me recent projects")}>Recent Projects</button>
          <button onClick={() => setInput("How do I create a task?")}>Create Task</button>
          <button onClick={() => setInput("Search documentation")}>Search Docs</button>
        </div>

        {/* Input */}
        <div className="copilot-input-container">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
          />
          <button
            className="copilot-send"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

const copilotCSS = `
/* Backdrop */
.copilot-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1001;
}

.copilot-backdrop.visible {
  opacity: 1;
  visibility: visible;
}

/* Panel */
.copilot-panel {
  position: fixed;
  top: 70px;
  right: 20px;
  width: 400px;
  height: calc(100vh - 100px);
  max-height: 700px;
  background: rgba(20, 20, 35, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  z-index: 1002;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05);

  /* Animation */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-20px) scale(0.95);
  transform-origin: top right;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.copilot-panel.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

/* Header */
.copilot-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.1), transparent);
}

.copilot-header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.copilot-header-icon svg {
  width: 24px;
  height: 24px;
}

.copilot-header-info {
  flex: 1;
}

.copilot-header-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.copilot-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.copilot-close {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.copilot-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.copilot-close svg {
  width: 18px;
  height: 18px;
}

/* Messages */
.copilot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.copilot-messages::-webkit-scrollbar {
  width: 6px;
}

.copilot-messages::-webkit-scrollbar-track {
  background: transparent;
}

.copilot-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.copilot-message {
  display: flex;
  gap: 10px;
  animation: messageIn 0.3s ease-out;
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.copilot-message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-avatar svg {
  width: 18px;
  height: 18px;
  color: white;
}

.message-bubble {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 1.5;
}

.copilot-message.user .message-bubble {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-bottom-right-radius: 4px;
}

.copilot-message.assistant .message-bubble {
  border-bottom-left-radius: 4px;
}

.message-bubble p {
  margin: 0;
}

/* Typing Indicator */
.message-bubble.typing {
  display: flex;
  gap: 4px;
  padding: 16px 20px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  animation: typingBounce 1.4s ease-in-out infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingBounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-8px);
  }
}

/* Quick Actions */
.copilot-quick-actions {
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  overflow-x: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.copilot-quick-actions::-webkit-scrollbar {
  display: none;
}

.copilot-quick-actions button {
  padding: 8px 14px;
  border-radius: 20px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.copilot-quick-actions button:hover {
  background: rgba(99, 102, 241, 0.25);
  border-color: rgba(99, 102, 241, 0.5);
  color: white;
}

/* Input */
.copilot-input-container {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0 0 20px 20px;
}

.copilot-input-container textarea {
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  resize: none;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
}

.copilot-input-container textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.copilot-input-container textarea:focus {
  border-color: rgba(99, 102, 241, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.copilot-send {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.copilot-send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

.copilot-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.copilot-send svg {
  width: 20px;
  height: 20px;
}

/* Responsive */
@media (max-width: 480px) {
  .copilot-panel {
    width: calc(100vw - 40px);
    right: 20px;
    left: 20px;
  }

  .copilot-trigger {
    right: 20px;
  }
}
`;
