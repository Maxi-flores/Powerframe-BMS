import "../apps/gms/src/styles/layout-tokens.css";
import "../apps/gms/src/styles/layout-primitives.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
