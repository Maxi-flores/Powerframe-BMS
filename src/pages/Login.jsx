import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/bms");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  }

  return (
    <div className="login-root">
      <style>{loginCSS}</style>

      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">🚀</div>
          <div className="logo-text">powerframe</div>
        </div>

        <form onSubmit={handleLogin}>
          <label>Username or email address</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="password-row">
            <label>Password</label>
            <span className="forgot">Forgot password?</span>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="btn-primary">
            Sign in
          </button>
        </form>

        <div className="divider">
          <span />
          <p>or</p>
          <span />
        </div>

        <button className="btn-oauth google">
          <span>G</span> Continue with Google
        </button>

        <button className="btn-oauth apple">
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
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #1c0066, #7a00cc);
  font-family: sans-serif;
}

.login-card {
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
