/* =========================================================
   GMS_V1.jsx — PowerFrame / TRT GMS Dashboard (V1)
   ---------------------------------------------------------
   Single-file React component that replicates the wireframe:
   - Left glass sidebar with icon rail + expandable sections
   - Top rounded nav bar with logo, title, search, actions
   - Modular card grid + "Add Widget" tile
   - Gradient background + soft borders + rounded geometry

    Usage (example):
      import GMS_V1 from "./GMS_V1";
      export default function App(){ return <GMS_V1 />; }

   Notes:
   - No external UI libs required
   - Uses inline SVG icons + embedded CSS
   - Replace placeholder handlers with real routing/data
   ========================================================= */

import React, { useMemo, useState } from "react";

export default function GMS_V1() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("Dashboard");
  const [openSections, setOpenSections] = useState(() => ({
    Dashboard: true,
    Out: false,
    Tasks: false,
    Plans: false,
    "Web search": false,
    Projects: false,
    Bestanden: false,
    Info: false,
  }));

  const navItems = useMemo(
    () => [
      { key: "Dashboard", icon: Icons.home },
      { key: "Out", icon: Icons.send },
      { key: "Tasks", icon: Icons.checklist },
      { key: "Plans", icon: Icons.calendar },
      { key: "Web search", icon: Icons.search },
      { key: "Projects", icon: Icons.folder },
      { key: "Bestanden", icon: Icons.archive },
      { key: "Info", icon: Icons.info },
    ],
    []
  );

  const cards = useMemo(
    () => [
      // Row 1 (3 large)
      { id: "c1", span: "span-4", title: "Module A" },
      { id: "c2", span: "span-4", title: "Module B" },
      { id: "c3", span: "span-4", title: "Module C" },

      // Row 2 (4 medium)
      { id: "c4", span: "span-3", title: "Module D" },
      { id: "c5", span: "span-3", title: "Module E" },
      { id: "c6", span: "span-3", title: "Module F" },
      { id: "c7", span: "span-3", title: "Module G" },

      // Row 3 (3 medium + add)
      { id: "c8", span: "span-4", title: "Module H" },
      { id: "c9", span: "span-4", title: "Module I" },
      { id: "c10", span: "span-4", title: "Module J" },
    ],
    []
  );

  function toggleSection(key) {
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));
    setActive(key);
  }

  function onQuickAdd() {
    // Replace with: openCreateModal(), createProject(), createTask(), etc.
    alert("Quick Add (+) — hook up your create flow here.");
  }

  function onAddWidget() {
    // Replace with: openWidgetLibrary(), createWidgetFromTemplate(), etc.
    alert("Add Widget — hook up widget library here.");
  }

  return (
    <div className="bms-root">
      <style>{CSS}</style>

      {/* Background glow gradient */}
      <div className="bms-bg" />

      <div className="bms-shell">
        {/* LEFT: Sidebar */}
        <aside className="bms-sidebar">
          <div className="bms-sidebar-inner">
            <div className="bms-brand">
              <div className="bms-brand-icon">{Icons.rocket}</div>
              <div className="bms-brand-meta">
                <div className="bms-brand-name">PowerFrame</div>
                <div className="bms-brand-sub">BMS • V1</div>
              </div>
            </div>

            <div className="bms-version">
              <div className="bms-version-row">
                <span className="bms-version-label">V1</span>
                <span className="bms-version-val">58%</span>
              </div>
              <div className="bms-progress">
                <div className="bms-progress-fill" style={{ width: "58%" }} />
              </div>
            </div>

            {/* Icon rail (left column) */}
            <div className="bms-sidebar-rail">
              <button className="bms-rail-btn" title="Collapse/Expand">
                {Icons.chevronUpDown}
              </button>

              {navItems.map((it) => (
                <button
                  key={it.key}
                  className={
                    "bms-rail-btn " + (active === it.key ? "is-active" : "")
                  }
                  title={it.key}
                  onClick={() => toggleSection(it.key)}
                >
                  {it.icon}
                </button>
              ))}

              <div className="bms-rail-spacer" />
              <button className="bms-rail-btn" title="Scroll to top">
                {Icons.chevronUp}
              </button>
              <button className="bms-rail-btn" title="Scroll to bottom">
                {Icons.chevronDown}
              </button>
            </div>

            {/* Expandable list (right column) */}
            <div className="bms-sidebar-list">
              {navItems.map((it) => (
                <div key={it.key} className="bms-nav-group">
                  <button
                    className={
                      "bms-nav-row " + (active === it.key ? "is-active" : "")
                    }
                    onClick={() => toggleSection(it.key)}
                  >
                    <span className="bms-nav-caret">
                      {openSections[it.key] ? Icons.caretDown : Icons.caretRight}
                    </span>
                    <span className="bms-nav-text">{it.key}</span>
                    <span className="bms-nav-line" />
                  </button>

                  {openSections[it.key] && (
                    <div className="bms-nav-children">
                      <button
                        className="bms-nav-child"
                        onClick={() => alert(`${it.key} • Overview (hook up route)`)}
                      >
                        Overview
                      </button>
                      <button
                        className="bms-nav-child"
                        onClick={() => alert(`${it.key} • Settings (hook up route)`)}
                      >
                        Settings
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Floating Quick Add button */}
          <button className="bms-fab" onClick={onQuickAdd} title="Quick Add">
            <span className="bms-fab-plus">+</span>
          </button>
        </aside>

        {/* RIGHT: Main */}
        <main className="bms-main">
          {/* Top Bar */}
          <header className="bms-topbar">
            <div className="bms-topbar-left">
              <div className="bms-topbar-logo">
                <span className="bms-topbar-logo-mark">{Icons.power}</span>
                <span className="bms-topbar-logo-text">PowerStarter</span>
              </div>
              <div className="bms-topbar-title">| Dashboard</div>
            </div>

            <div className="bms-topbar-center">
              <label className="bms-search-label">Zoeken:</label>
              <div className="bms-search">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search modules, tasks, projects…"
                />
                <span className="bms-search-icon">{Icons.search}</span>
              </div>
            </div>

            <div className="bms-topbar-right">
              <button className="bms-topbar-btn" title="Notifications">
                {Icons.bell}
              </button>
              <button className="bms-topbar-btn" title="Profile">
                {Icons.user}
              </button>
              <button className="bms-topbar-btn" title="Menu">
                {Icons.menu}
              </button>
              <button className="bms-topbar-ai" title="AI Assistant">
                {Icons.ai}
              </button>
            </div>
          </header>

          {/* Grid */}
          <section className="bms-grid-wrap">
            <div className="bms-grid">
              {cards.map((c) => (
                <Card key={c.id} span={c.span} title={c.title} />
              ))}

              {/* Add Widget tile — matches the purple tile at bottom-right */}
              <div className="bms-add-tile span-4">
                <button className="bms-add-tile-btn" onClick={onAddWidget}>
                  <span className="bms-add-plus">{Icons.plus}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Bottom watermark */}
          <footer className="bms-footer">
            <div className="bms-watermark">
              <span className="bms-watermark-mark">{Icons.powerSmall}</span>
              <span className="bms-watermark-text">powerframe</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* ----------------------------- Components ----------------------------- */

function Card({ span, title }) {
  return (
    <div className={"bms-card " + span}>
      <div className="bms-card-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="bms-card-body">
        <div className="bms-card-title">{title}</div>
        <div className="bms-card-sub">
          Placeholder module tile (draggable/resizable in later versions).
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Icons ------------------------------- */

const Icons = {
  rocket: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path
        d="M14 4c3.5 0 6 2.5 6 6-2.5 4-6.5 8-10.5 10.5-3.5 0-5.5-2-5.5-5.5C6 10.5 10 6.5 14 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M10 14l-2 2M12 16l-2 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15.5 8.5h.01"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  power: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 2v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 4.5C4.5 6.3 3 9 3 12c0 5 4 9 9 9s9-4 9-9c0-3-1.5-5.7-4-7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  powerSmall: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path
        d="M12 2v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 4.5C4.5 6.3 3 9 3 12c0 5 4 9 9 9s9-4 9-9c0-3-1.5-5.7-4-7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M3 11.5 21 3l-8.5 18-2.5-7-7-2.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),
  checklist: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M9 6h12M9 12h12M9 18h12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3.5 6.2 5 7.7 7.6 5.1M3.5 12.2 5 13.7 7.6 11.1M3.5 18.2 5 19.7 7.6 17.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M7 3v3M17 3v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 7h16M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16.8 16.8 21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M3.5 6.5h6l2 2H20.5a1.5 1.5 0 0 1 1.5 1.5v9.5a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2V8a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),
  archive: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M4 7h16M6 7v14h12V7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 3h8l1 4H7l1-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 12h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 10.5v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 7.5h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 19a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 21a8 8 0 0 1 16 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 3 3 21h4l2-4h6l2 4h4L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 13h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  chevronUpDown: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M8 10l4-4 4 4M8 14l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  chevronUp: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M6 14l6-6 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M6 10l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  caretDown: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  caretRight: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path
        d="M10 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

/* ------------------------------- Styles ------------------------------- */

const CSS = `
  :root{
    --bg0: #0b0a1a;
    --bg1: #2b0bd6;
    --bg2: #7b00ff;

    --glass: rgba(25, 25, 35, 0.55);
    --glass2: rgba(25, 25, 40, 0.35);
    --stroke: rgba(255,255,255,0.12);
    --stroke2: rgba(120,140,255,0.35);
    --stroke3: rgba(140,160,255,0.65);

    --text: rgba(255,255,255,0.92);
    --muted: rgba(255,255,255,0.65);
    --muted2: rgba(255,255,255,0.45);

    --card: rgba(140, 150, 165, 0.48);
    --card2: rgba(120, 130, 155, 0.34);

    --shadow: 0 14px 50px rgba(0,0,0,0.45);
    --shadow2: 0 10px 28px rgba(0,0,0,0.35);

    --r-lg: 18px;
    --r-md: 14px;
    --r-sm: 12px;
  }

  *{ box-sizing: border-box; }
  html, body { height: 100%; }
  body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Helvetica Neue", Helvetica, "Apple Color Emoji","Segoe UI Emoji"; }

  .bms-root{
    min-height: 100vh;
    color: var(--text);
    position: relative;
    overflow: hidden;
    background: radial-gradient(1200px 600px at 20% 20%, rgba(255,255,255,0.06), transparent 60%),
                linear-gradient(135deg, #070614 0%, #0a0619 35%, #1a0b3a 60%, #050514 100%);
  }

  .bms-bg{
    position:absolute;
    inset:-60px;
    background: linear-gradient(90deg, rgba(120,0,255,0.55), rgba(30,70,255,0.55));
    filter: blur(0px);
    opacity: 0.9;
    z-index: 0;
    pointer-events: none;
  }

  .bms-shell{
    position: relative;
    z-index: 1;
    display:flex;
    min-height: 100vh;
    padding: 18px;
    gap: 18px;
  }

  /* Sidebar */
  .bms-sidebar{
    position: relative;
    width: 290px;
    min-width: 290px;
  }

  .bms-sidebar-inner{
    height: calc(100vh - 36px);
    border-radius: 20px;
    background: linear-gradient(180deg, rgba(35,35,45,0.62), rgba(18,18,25,0.62));
    border: 1px solid var(--stroke);
    box-shadow: var(--shadow);
    overflow: hidden;
    display:grid;
    grid-template-columns: 58px 1fr;
    grid-template-rows: auto auto 1fr;
  }

  .bms-brand{
    grid-column: 1 / -1;
    display:flex;
    align-items:center;
    gap: 10px;
    padding: 14px 14px 10px 14px;
  }

  .bms-brand-icon{
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--stroke);
    display:flex;
    align-items:center;
    justify-content:center;
    color: rgba(255,255,255,0.92);
  }

  .bms-brand-meta{ line-height: 1.1; }
  .bms-brand-name{ font-weight: 700; letter-spacing: 0.3px; font-size: 13px; }
  .bms-brand-sub{ font-size: 11px; color: var(--muted2); margin-top: 2px; }

  .bms-version{
    grid-column: 1 / -1;
    padding: 8px 14px 12px 14px;
  }

  .bms-version-row{
    display:flex;
    align-items:center;
    justify-content:space-between;
    font-size: 12px;
    color: var(--muted);
  }
  .bms-progress{
    margin-top: 8px;
    height: 6px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.08);
    overflow:hidden;
  }
  .bms-progress-fill{
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(255,255,255,0.75), rgba(130,180,255,0.8));
  }

  .bms-sidebar-rail{
    border-right: 1px solid rgba(255,255,255,0.08);
    padding: 10px 8px;
    display:flex;
    flex-direction:column;
    gap: 10px;
    align-items:center;
  }

  .bms-rail-btn{
    width: 42px;
    height: 42px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.82);
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
  }
  .bms-rail-btn:hover{
    transform: translateY(-1px);
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.14);
  }
  .bms-rail-btn.is-active{
    border-color: rgba(160,180,255,0.55);
    box-shadow: 0 0 0 3px rgba(120,140,255,0.14) inset;
  }
  .bms-rail-spacer{ flex: 1; }

  .bms-sidebar-list{
    padding: 10px 10px 12px 10px;
    overflow:auto;
  }
  .bms-sidebar-list::-webkit-scrollbar{ width: 10px; }
  .bms-sidebar-list::-webkit-scrollbar-thumb{ background: rgba(255,255,255,0.10); border-radius: 999px; }
  .bms-sidebar-list::-webkit-scrollbar-track{ background: transparent; }

  .bms-nav-group{ margin-bottom: 8px; }
  .bms-nav-row{
    width: 100%;
    display:flex;
    align-items:center;
    gap: 8px;
    padding: 10px 10px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.86);
    cursor:pointer;
    transition: background 120ms ease, border-color 120ms ease;
  }
  .bms-nav-row:hover{
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.14);
  }
  .bms-nav-row.is-active{
    border-color: rgba(160,180,255,0.55);
    background: rgba(120,140,255,0.10);
  }
  .bms-nav-caret{
    width: 18px; height: 18px;
    display:flex; align-items:center; justify-content:center;
    color: rgba(255,255,255,0.72);
    flex: 0 0 auto;
  }
  .bms-nav-text{
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    white-space: nowrap;
  }
  .bms-nav-line{
    margin-left: auto;
    height: 2px;
    width: 52px;
    background: rgba(255,255,255,0.16);
    border-radius: 999px;
    opacity: 0.65;
  }
  .bms-nav-children{
    padding: 6px 6px 0 30px;
    display:flex;
    flex-direction:column;
    gap: 6px;
  }
  .bms-nav-child{
    text-align:left;
    padding: 8px 10px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: rgba(255,255,255,0.72);
    cursor:pointer;
  }
  .bms-nav-child:hover{ background: rgba(255,255,255,0.05); }

  .bms-fab{
    position:absolute;
    left: 215px;
    bottom: -4px;
    width: 56px;
    height: 56px;
    border-radius: 999px;
    border: none;
    cursor:pointer;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22), rgba(255,255,255,0) 55%),
                #2be35c;
    box-shadow: 0 18px 40px rgba(0,0,0,0.55);
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .bms-fab-plus{
    font-size: 34px;
    line-height: 1;
    color: rgba(0,0,0,0.75);
    transform: translateY(-1px);
  }

  /* Main */
  .bms-main{
    flex:1;
    min-width: 0;
    display:flex;
    flex-direction:column;
    gap: 14px;
  }

  .bms-topbar{
    height: 64px;
    border-radius: 20px;
    background: linear-gradient(90deg, rgba(20,20,28,0.62), rgba(18,18,25,0.45));
    border: 1px solid rgba(255,255,255,0.14);
    box-shadow: var(--shadow2);
    display:flex;
    align-items:center;
    padding: 0 14px;
    gap: 14px;
  }

  .bms-topbar-left{
    display:flex;
    align-items:center;
    gap: 12px;
    min-width: 260px;
  }

  .bms-topbar-logo{
    display:flex;
    align-items:center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.04);
  }
  .bms-topbar-logo-mark{ display:flex; align-items:center; justify-content:center; color: rgba(255,255,255,0.90); }
  .bms-topbar-logo-text{ font-weight: 700; font-size: 13px; letter-spacing: 0.2px; }
  .bms-topbar-title{ font-weight: 800; font-size: 18px; letter-spacing: 0.2px; }

  .bms-topbar-center{
    flex: 1;
    display:flex;
    align-items:center;
    gap: 10px;
    min-width: 280px;
  }
  .bms-search-label{ font-size: 13px; color: var(--muted); }
  .bms-search{
    position: relative;
    flex: 1;
    height: 38px;
  }
  .bms-search input{
    width: 100%;
    height: 38px;
    border-radius: 999px;
    padding: 0 40px 0 14px;
    border: 1px solid rgba(255,255,255,0.14);
    outline: none;
    background: rgba(0,0,0,0.18);
    color: rgba(255,255,255,0.92);
  }
  .bms-search input::placeholder{ color: rgba(255,255,255,0.35); }
  .bms-search-icon{
    position:absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.55);
    pointer-events:none;
  }

  .bms-topbar-right{
    display:flex;
    align-items:center;
    gap: 10px;
  }

  .bms-topbar-btn{
    width: 40px;
    height: 40px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.86);
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
  }
  .bms-topbar-btn:hover{
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.18);
  }

  .bms-topbar-ai{
    width: 46px;
    height: 46px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.18);
    background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04));
    color: rgba(255,255,255,0.92);
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    box-shadow: 0 10px 28px rgba(0,0,0,0.25);
  }

  /* Grid */
  .bms-grid-wrap{
    flex: 1;
    min-height: 0;
    border-radius: 22px;
    background: rgba(0,0,0,0.08);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 14px;
    box-shadow: var(--shadow2);
    overflow:auto;
  }
  .bms-grid-wrap::-webkit-scrollbar{ height: 10px; width: 10px; }
  .bms-grid-wrap::-webkit-scrollbar-thumb{ background: rgba(255,255,255,0.10); border-radius: 999px; }
  .bms-grid{
    display:grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 14px;
  }

  .span-4{ grid-column: span 4; }
  .span-3{ grid-column: span 3; }

  .bms-card{
    position: relative;
    min-height: 148px;
    border-radius: 20px;
    background: linear-gradient(180deg, var(--card), var(--card2));
    border: 1px solid rgba(140,160,255,0.48);
    box-shadow: 0 10px 26px rgba(0,0,0,0.25);
    overflow:hidden;
  }
  .bms-card::after{
    content:"";
    position:absolute;
    inset:0;
    border-radius: 20px;
    box-shadow: 0 0 0 2px rgba(70,110,255,0.18) inset;
    pointer-events:none;
  }

  .bms-card-dots{
    position:absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    display:flex;
    gap: 6px;
    opacity: 0.35;
  }
  .bms-card-dots span{
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: rgba(0,0,0,0.35);
  }

  .bms-card-body{
    padding: 34px 16px 16px 16px;
  }
  .bms-card-title{
    font-weight: 800;
    letter-spacing: 0.2px;
    font-size: 14px;
    color: rgba(255,255,255,0.92);
  }
  .bms-card-sub{
    margin-top: 6px;
    font-size: 12px;
    color: rgba(255,255,255,0.70);
    max-width: 44ch;
  }

  /* Add Tile */
  .bms-add-tile{
    min-height: 148px;
    border-radius: 22px;
    border: 1px solid rgba(255,255,255,0.10);
    background: linear-gradient(180deg, rgba(80,60,210,0.35), rgba(60,45,170,0.25));
    display:flex;
    align-items:center;
    justify-content:center;
  }

  .bms-add-tile-btn{
    width: 92px;
    height: 58px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.18);
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    box-shadow: 0 12px 28px rgba(0,0,0,0.22);
  }
  .bms-add-tile-btn:hover{
    background: rgba(255,255,255,0.22);
    border-color: rgba(255,255,255,0.22);
  }
  .bms-add-plus{
    color: rgba(255,255,255,0.88);
    display:flex;
    align-items:center;
    justify-content:center;
  }

  /* Footer watermark */
  .bms-footer{
    height: 40px;
    display:flex;
    align-items:center;
    justify-content:center;
    pointer-events:none;
  }
  .bms-watermark{
    display:flex;
    align-items:center;
    gap: 8px;
    opacity: 0.35;
    color: rgba(255,255,255,0.75);
    letter-spacing: 0.8px;
    text-transform: lowercase;
    font-weight: 700;
    font-size: 12px;
  }

  /* Responsive */
  @media (max-width: 1100px){
    .bms-sidebar{ width: 260px; min-width: 260px; }
    .bms-topbar-left{ min-width: 220px; }
    .span-4{ grid-column: span 6; }
    .span-3{ grid-column: span 6; }
  }

  @media (max-width: 780px){
    .bms-shell{ flex-direction: column; }
    .bms-sidebar{ width: 100%; min-width: 0; }
    .bms-sidebar-inner{
      height: auto;
      grid-template-columns: 58px 1fr;
    }
    .bms-fab{ left: calc(100% - 76px); bottom: -10px; }
    .bms-topbar{ flex-wrap: wrap; height: auto; padding: 12px; }
    .bms-topbar-left{ min-width: 0; width: 100%; }
    .bms-topbar-center{ width: 100%; }
    .bms-grid{ grid-template-columns: repeat(12, 1fr); }
    .span-4, .span-3{ grid-column: span 12; }
  }
`;
