// src/components/LoginEntryBox.tsx
type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function LoginEntryBox({ className, style }: Props) {
  return (
    <div
      className={className}
      style={{
        ...style,
        background: "#1E293B",
        borderRadius: 12,
        padding: 24,
        width: 320,
        marginTop: 24,
      }}
    >
      <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>Login Entry</h3>
      <input style={inputStyle} placeholder="Email Address" />
      <input style={{ ...inputStyle, marginTop: 12 }} placeholder="Password" />
      <button style={buttonStyle}>Sign In</button>
      <a href="#" style={linkStyle}>Forgot password?</a>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "#334155",
  border: "none",
  borderRadius: 8,
  color: "#E2E8F0",
  marginBottom: 12,
};
const buttonStyle = {
  width: "100%",
  padding: 12,
  background: "#3B82F6",
  color: "white",
  border: "none",
  borderRadius: 8,
  fontWeight: 500,
  margin: "16px 0",
  cursor: "pointer",
};
const linkStyle = {
  display: "block",
  textAlign: "center" as "center" as const,
  color: "#60A5FA",
  textDecoration: "none",
  fontSize: 14,
};