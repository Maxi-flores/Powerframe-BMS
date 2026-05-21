import React from "react";

/**
 * @param {{ cols?: number, className?: string, children?: React.ReactNode }} props
 */
export default function Grid({ cols = 2, className = "", children }) {
  const safeCols = Number.isFinite(cols) && cols > 0 ? Math.round(cols) : 2;
  const style = { gridTemplateColumns: `repeat(${safeCols}, minmax(0, 1fr))` };

  return (
    <div className={`gms-grid ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

