// src/components/LoginForm.tsx
import { useState } from "react";

type LoginFormProps = {
  className?: string;
  style?: React.CSSProperties;
  buttonText?: string;
  showSignup?: boolean;
  onLogin?: (email: string, password: string) => void;
};

export default function LoginForm({
  className,
  style,
  buttonText = "Log in",
  showSignup = true,
  onLogin,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin?.(email, password);
  };

  // ──────────────────────────────────────
  // DEFAULT STYLES (can be overridden in Plasmic)
  // ──────────────────────────────────────
  const defaultStyles: React.CSSProperties = {
    width: 380,
    background: "#FFFFFF",
    borderRadius: 16,
    padding: 40,
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 52,
    padding: "0 16px",
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    fontSize: 15,
    color: "#6B7280",
    outline: "none",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    height: 52,
    marginTop: 24,
    background: "#2563EB",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 500,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  };

  const linkStyle: React.CSSProperties = {
    color: "#2563EB",
    textDecoration: "none",
  };

  return (
    <form
      className={className}
      style={{ ...defaultStyles, ...style }}  // ← MERGE STYLES
      onSubmit={handleSubmit}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
        <svg width="32" height="32" viewBox="0 0 32 32" style={{ marginRight: 12 }}>
          <path
            d="M16 2.5L25.3205 8.25V19.75L16 25.5L6.67949 19.75V8.25L16 2.5Z"
            fill="none"
            stroke="#2563EB"
            strokeWidth="2"
          />
          <text x="16" y="20" fontWeight="bold" fontSize="16" fill="#FFF" textAnchor="middle">
            P
          </text>
        </svg>
        <h1 style={{ fontSize: 22, fontWeight: "bold", color: "#1F2937", margin: 0 }}>
          Powerframe CRM
        </h1>
      </div>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />

      {/* Password */}
      <div style={{ position: "relative", marginTop: 16 }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <EyeIcon />
        </button>
      </div>

      {/* Button */}
      <button type="submit" style={buttonStyle}>
        {buttonText}
      </button>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, fontSize: 14 }}>
        <a href="#" style={linkStyle}>Forgot password?</a>
        {showSignup && <a href="#" style={linkStyle}>Sign up</a>}
      </div>
    </form>
  );
}

// ──────────────────────────────────────
// Eye Icon
// ──────────────────────────────────────
function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}