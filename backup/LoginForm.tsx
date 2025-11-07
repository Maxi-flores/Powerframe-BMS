import React from "react";
import { PlasmicCanvasHost } from "@plasmicapp/host";

export function LoginForm({ onLogin }: { onLogin: (email: string, password: string) => void }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={submit} style={styles.card}>
      <div style={styles.header}>
        {/* Logo slot */}
        <img src="/logo.png" style={styles.logo} alt="Powerframe Logo" />
        <h2>Powerframe CRM</h2>
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <div style={styles.passwordWrapper}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <span style={styles.icon}>✉️</span>
      </div>

      <button type="submit" style={styles.button}>
        Log in
      </button>

      <div style={styles.footerLinks}>
        <a href="/reset">Forgot password?</a>
        <a href="/signup">Sign up</a>
      </div>
    </form>
  );
}

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 32px rgba(0,0,0,0.15)",
    width: "300px",
  },
  header: { textAlign: "center" },
  logo: { width: "32px", marginBottom: "10px" },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  passwordWrapper: { position: "relative" },
  icon: { position: "absolute", right: 10, top: 12 },
  button: {
    background: "#000",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  footerLinks: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
  }
};

