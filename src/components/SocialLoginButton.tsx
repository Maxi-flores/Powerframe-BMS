// src/components/SocialLoginButton.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  provider: "google" | "apple";
};

export default function SocialLoginButton({ className, style, provider }: Props) {
  const isGoogle = provider === "google";
  return (
    <button
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        width: "100%",
        padding: 12,
        background: "#1E293B",
        border: "1px solid #334155",
        borderRadius: 8,
        color: "#E2E8F0",
        fontSize: 14,
        marginTop: 8,
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 20 }}>{isGoogle ? "G" : "A"}</span>
      Sign in with {isGoogle ? "Google" : "Apple"}
    </button>
  );
}