import React, { useState, useEffect, useRef, forwardRef, createContext, useContext } from "react";
import React from "react";
import "./MagicBento.css";

interface MagicBentoProps {
  children: React.ReactNode;
  glowColor?: string;
  spotlightRadius?: number;
  disableAnimations?: boolean;
}

export default function MagicBento({
  children,
  glowColor = "#007AFF",
  spotlightRadius = 400,
  disableAnimations = false,
}: MagicBentoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disableAnimations) return;

    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(".bento-card");

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const relativeX = ((mouseX / rect.width) * 100).toFixed(2);
      const relativeY = ((mouseY / rect.height) * 100).toFixed(2);
      const distance = Math.min(Math.hypot(mouseX - rect.width / 2, mouseY - rect.height / 2), spotlightRadius);
      const glow = Math.max(0, 1 - distance / spotlightRadius);

      cards.forEach(card => (card as HTMLElement).style.setProperty('--glow-x', `${relativeX}%`));
      cards.forEach(card => (card as HTMLElement).style.setProperty('--glow-y', `${relativeY}%`));
      cards.forEach(card => (card as HTMLElement).style.setProperty('--glow-intensity', glow.toString()));
      cards.forEach(card => (card as HTMLElement).style.setProperty('--glow-radius', `${spotlightRadius}px`));
      cards.forEach(card => (card as HTMLElement).style.setProperty('--glow-color', glowColor));
    };

    const handleMouseLeave = () => {
      cards.forEach(card => (card as HTMLElement).style.setProperty('--glow-intensity', '0'));
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [glowColor, spotlightRadius, disableAnimations]);

  return (
    <div ref={containerRef} className="magic-bento-container">
      {children}
    </div>
  );
}
