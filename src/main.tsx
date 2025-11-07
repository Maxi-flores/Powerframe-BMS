import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PLASMIC } from "./plasmic-init";
import PlasmicHost from "./plasmic-host";
import DashboardLayoutHome from "./components/DashboardLayoutHome";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PLASMIC.Provider>
      <PlasmicHost />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<DashboardLayoutHome />} />
        </Routes>
      </BrowserRouter>
    </PLASMIC.Provider>
  </React.StrictMode>
);
