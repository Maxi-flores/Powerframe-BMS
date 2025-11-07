import React from "react";

export function Counter({ className }: { className?: string }) {
  const [count, setCount] = React.useState(0);

  return (
    <button className={className} onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}

