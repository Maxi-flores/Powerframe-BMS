// Canonical Powerframe Reset Password Page
// This is the reference design for Firebase password reset
// Import this or adapt it based on your auth context setup

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Aurora from "../components/Aurora.jsx";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetPassword(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await resetPassword(email);
      setMessage(
        "Password reset email sent! Check your inbox for further instructions."
      );
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="reset-root">
      <Aurora />
      <style>{resetCSS}</style>

      <div className="reset-card">
        <div className="reset-logo">
          <div className="logo-icon">🚀</div>
          <div className="logo-text">powerframe</div>
        </div>

        <h2>Reset Password</h2>
        <p className="reset-subtitle">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleResetPassword}>
          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />

          {error && <div className="error-msg">{error}</div>}
          {message && <div className="success-msg">{message}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        <div className="back-to-login">
          <span onClick={() => navigate("/login")} className="back-link">
            Back to login
          </span>
        </div>
      </div>
    </div>
  );
}

const resetCSS = `
.reset-root {
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  z-index: 1;
}

.reset-card {
  position: relative;
  z-index: 2;
  width: 400px;
  padding: 40px;
  border-radius: 30px;
  background: rgba(20, 20, 60, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  flex-direction: column;
}

.reset-logo {
  text-align: center;
  margin-bottom: 20px;
}

.reset-logo .logo-icon {
  font-size: 40px;
}

.reset-logo .logo-text {
  font-size: 22px;
  margin-top: 5px;
  letter-spacing: 2px;
}

.reset-card h2 {
  text-align: center;
  margin-bottom: 10px;
  font-size: 24px;
}

.reset-subtitle {
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 25px;
  line-height: 1.4;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
}

input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.3);
  color: white;
  margin-bottom: 20px;
  font-size: 14px;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.btn-primary {
  padding: 14px;
  border: none;
  border-radius: 8px;
  background: #52c41a;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
  transition: opacity 0.2s;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.error-msg {
  color: #ff6b6b;
  font-size: 13px;
  margin-bottom: 15px;
  text-align: center;
  padding: 10px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 6px;
}

.success-msg {
  color: #52c41a;
  font-size: 13px;
  margin-bottom: 15px;
  text-align: center;
  padding: 10px;
  background: rgba(82, 196, 26, 0.1);
  border-radius: 6px;
}

.back-to-login {
  text-align: center;
  font-size: 13px;
}

.back-link {
  color: #8ab4ff;
  cursor: pointer;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.8;
}
`;
