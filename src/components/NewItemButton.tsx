// src/components/NewItemButton.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function NewItemButton({ className, style }: Props) {
  return (
    <button
      className={className}
      style={{
        ...style,
        background: "#3B82F6",
        color: "white",
        border: "none",
        borderRadius: 8,
        padding: "8px 16px",
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      + New Item
    </button>
  );
}