import React from "react";

/**
 * @typedef {"sm"|"md"|"lg"|"xl"|"max"} ContainerSize
 */

/**
 * @param {{ size?: ContainerSize, className?: string, children?: React.ReactNode }} props
 */
export default function Container({ size = "max", className = "", children }) {
  const sizeClass =
    size === "sm"
      ? "gms-container--sm"
      : size === "md"
        ? "gms-container--md"
        : size === "lg"
          ? "gms-container--lg"
          : size === "xl"
            ? "gms-container--xl"
            : "gms-container--max";

  return (
    <div className={`gms-container ${sizeClass} ${className}`.trim()}>
      {children}
    </div>
  );
}

