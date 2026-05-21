import React from "react";

/**
 * @param {{ className?: string, children?: React.ReactNode }} props
 */
export default function Inline({ className = "", children }) {
  return <div className={`gms-inline ${className}`.trim()}>{children}</div>;
}

