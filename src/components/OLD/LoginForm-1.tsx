// src/components/LoginForm.tsx
import { useState } from "react";

type LoginFormProps = {
  buttonText?: string;
  showSignup?: boolean;
  onLogin?: (email: string, password: string) => void;
};

export default function LoginForm({
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

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: 380,
        background: "#FFFFFF",
        borderRadius: 16,
        padding: 40,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* … logo … */}
      {/* Email & Password inputs (same as before) */}
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

/* keep the same style objects (inputStyle, buttonStyle, linkStyle) */

