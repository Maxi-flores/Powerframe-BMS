// Canonical Powerframe Login Page
// This is the reference design for Firebase-based authentication
// Import this or adapt it based on your auth context setup

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Aurora from "../components/Aurora.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/bms");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate("/bms");
    } catch (err) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-root">
      <Aurora />
      <style>{loginCSS}</style>

      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">🚀</div>
          <div className="logo-text">powerframe</div>
        </div>

        <form onSubmit={handleLogin}>
          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />

          <div className="password-row">
            <label>Password</label>
            <span
              className="forgot"
              onClick={() => navigate("/reset-password")}
            >
              Forgot password?
            </span>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="divider">
          <span />
          <p>or</p>
          <span />
        </div>

        <button
          type="button"
          className="btn-oauth google"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <span>G</span> Continue with Google
        </button>

        <button type="button" className="btn-oauth apple" disabled>
          <span></span> Continue with Apple
        </button>

        <div className="create-account">
          New to Powerframe? <span>Create an account</span>
        </div>
      </div>
    </div>
  );
}

const loginCSS = `
.login-root {
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  z-index: 1;
}

.login-card {
  position: relative;
  z-index: 2;
  width: 400px;
  padding: 40px;
  border-radius: 30px;
  background: rgba(20, 20, 60, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  display: flex;
  flex-direction: column;
}

.login-logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo-icon {
  font-size: 40px;
}

.logo-text {
  font-size: 22px;
  margin-top: 5px;
  letter-spacing: 2px;
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
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(0,0,0,0.3);
  color: white;
  margin-bottom: 20px;
}

.password-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot {
  font-size: 12px;
  color: #8ab4ff;
  cursor: pointer;
  transition: opacity 0.2s;
}

.forgot:hover {
  opacity: 0.8;
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
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.divider span {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.2);
}

.divider p {
  margin: 0 10px;
  font-size: 14px;
}

.btn-oauth {
  padding: 12px;
  border-radius: 8px;
  border: none;
  margin-bottom: 15px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

.btn-oauth:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-oauth:hover:not(:disabled) {
  opacity: 0.9;
}

.google {
  background: #3b82f6;
  color: white;
}

.apple {
  background: #555;
  color: white;
}

.create-account {
  margin-top: 10px;
  font-size: 13px;
  text-align: center;
}

.create-account span {
  color: #8ab4ff;
  cursor: pointer;
}
`;
