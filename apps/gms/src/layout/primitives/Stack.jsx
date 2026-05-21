import React from "react";

/**
 * @param {{ className?: string, children?: React.ReactNode }} props
 */
export default function Stack({ className = "", children }) {
  return <div className={`gms-stack ${className}`.trim()}>{children}</div>;
}

