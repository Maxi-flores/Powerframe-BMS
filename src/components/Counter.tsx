import React, { useState, useEffect, useRef, forwardRef, createContext, useContext } from "react";
export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
