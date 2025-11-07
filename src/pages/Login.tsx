// src/pages/Login.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";
import { PlasmicRootProvider } from "@plasmicapp/loader-react";
import { PLASMIC } from "@/plasmic-init";
import LoginBackground from "@/components/LoginBackground";
import LoginForm from "@/components/LoginForm";

export default function Login() {
  return (
    <PlasmicRootProvider loader={PLASMIC}>
      {/* Full-screen background – styleable in Plasmic */}
      <LoginBackground />

      {/* Centered form overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <LoginForm
            onLogin={(email, password) => {
              console.log("Login:", { email, password });
            }}
          />
        </div>
      </div>
    </PlasmicRootProvider>
  );
}