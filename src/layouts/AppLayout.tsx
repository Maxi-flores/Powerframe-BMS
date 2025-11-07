import React, { useState, useEffect, useRef, forwardRef, createContext, useContext } from "react";
// src/layouts/AppLayout.tsx
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <Header />
      {/* Content starts below header (64px) and right of sidebar (56px) */}
      <div style={{ marginLeft: 56, marginTop: 64, minHeight: "calc(100vh - 64px)" }}>
        {children}
      </div>
    </>
  );
}