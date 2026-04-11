import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useProjects } from "../context/ProjectContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useWorkState } from "../context/WorkStateContext.jsx";
import Copilot from "../components/Copilot.jsx";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeProject, projects, switchProject } = useProjects();
  const { currentTheme } = useTheme();
  const { workState, workStateConfig, healthScore } = useWorkState();

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showProjectSwitcher, setShowProjectSwitcher] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [search, setSearch] = useState("");

  const navItems = [
    { key: "Dashboard", path: "/bms", icon: Icons.home },
    { key: "Out", path: "/bms/out", icon: Icons.send },
    { key: "Tasks", path: "/bms/tasks", icon: Icons.checklist },
    { key: "Plans", path: "/bms/plans", icon: Icons.calendar },
    { key: "Workflow", path: "/bms/workstate", icon: Icons.workflow },
    { key: "Web search", path: "/bms/search", icon: Icons.search },
    { key: "Projects", path: "/bms/projects", icon: Icons.folder },
    { key: "Bestanden", path: "/bms/files", icon: Icons.archive },
    { key: "Info", path: "/bms/info", icon: Icons.info },
  ];

  const currentPath = location.pathname;
  const activeKey = navItems.find(item =>
    item.path === currentPath || (item.path !== "/bms" && currentPath.startsWith(item.path))
  )?.key || "Dashboard";

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/bms-login");
  }

  // Close menu when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (showMenu && !e.target.closest(".menu-container")) {
        setShowMenu(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showMenu]);

  const dynamicStyles = `
    .bms-root {
      background: ${currentTheme.customBg || currentTheme.gradient};
    }
    .bms-bg {
      background: linear-gradient(90deg, ${currentTheme.bg1}, ${currentTheme.bg2});
    }
    .bms-nav-btn.is-active {
      background: ${currentTheme.accent}22;
      border-color: ${currentTheme.accent}66;
    }
    .bms-fab {
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22), transparent 55%), ${currentTheme.accent};
    }
  `;

  return (
    <div className="bms-root">
      <style>{CSS}</style>
      <style>{dynamicStyles}</style>
      <div className="bms-bg" />

      <div className="bms-shell">
        {/* Collapsible Sidebar */}
        <aside
          className={`bms-sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => { setSidebarExpanded(false); setShowProjectSwitcher(false); }}
        >
          <div className="bms-sidebar-inner">
            {/* Brand */}
            <div
              className="bms-brand"
              onClick={() => setShowProjectSwitcher(!showProjectSwitcher)}
            >
              <div className="bms-brand-icon" style={{ background: activeProject?.color }}>
                {Icons.rocket}
              </div>
              <div className="bms-brand-meta">
                <div className="bms-brand-name">{activeProject?.name || "PowerFrame"}</div>
                <div className="bms-brand-sub">BMS • V1</div>
              </div>
            </div>

            {/* Project Switcher Dropdown */}
            {showProjectSwitcher && sidebarExpanded && (
              <div className="project-switcher">
                {projects.map(p => (
                  <button
                    key={p.id}
                    className={`project-switch-btn ${p.id === activeProject?.id ? "active" : ""}`}
                    onClick={() => { switchProject(p.id); setShowProjectSwitcher(false); }}
                  >
                    <span className="project-dot" style={{ background: p.color }} />
                    <span className="project-name">{p.name}</span>
                  </button>
                ))}
                <button
                  className="project-switch-btn add"
                  onClick={() => { navigate("/bms/projects"); setShowProjectSwitcher(false); }}
                >
                  + New Project
                </button>
              </div>
            )}

            {/* Health Score & WorkState */}
            <div className="bms-version">
              <div className="bms-version-row">
                <span className="bms-version-label">Health</span>
                <span
                  className="bms-version-val"
                  style={{
                    color: healthScore >= 90 ? "#22c55e" : healthScore >= 60 ? "#f59e0b" : "#ef4444",
                  }}
                >
                  {healthScore}%
                </span>
              </div>
              <div className="bms-progress">
                <div
                  className="bms-progress-fill"
                  style={{
                    width: `${healthScore}%`,
                    background: healthScore >= 90 ? "#22c55e" : healthScore >= 60 ? "#f59e0b" : "#ef4444",
                  }}
                />
              </div>
              {sidebarExpanded && (
                <button
                  className="bms-workstate-pill"
                  style={{ background: workStateConfig.color + "22", color: workStateConfig.color, borderColor: workStateConfig.color + "55" }}
                  onClick={() => navigate("/bms/workstate")}
                >
                  {workStateConfig.icon} {workStateConfig.label}
                </button>
              )}
            </div>

            {/* Navigation */}
            <nav className="bms-nav">
              {navItems.map((it) => (
                <button
                  key={it.key}
                  className={`bms-nav-btn ${activeKey === it.key ? "is-active" : ""}`}
                  onClick={() => navigate(it.path)}
                  title={it.key}
                >
                  <span className="nav-icon">{it.icon}</span>
                  <span className="nav-text">{it.key}</span>
                </button>
              ))}
            </nav>

            {/* Bottom controls */}
            <div className="bms-sidebar-footer">
              <button className="bms-nav-btn" title="Scroll up">{Icons.chevronUp}</button>
              <button className="bms-nav-btn" title="Scroll down">{Icons.chevronDown}</button>
            </div>
          </div>

          {/* FAB */}
          <button className="bms-fab" onClick={() => navigate("/bms/projects")} title="New Project">
            <span className="bms-fab-plus">+</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="bms-main">
          {/* Top Bar */}
          <header className="bms-topbar">
            <div className="bms-topbar-left">
              <div className="bms-topbar-logo">
                <span className="bms-topbar-logo-mark">{Icons.power}</span>
                <span className="bms-topbar-logo-text">PowerStarter</span>
              </div>
              <div className="bms-topbar-title">| {activeKey}</div>
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
              {/* Health Score chip */}
              <button
                className="bms-health-chip"
                title="Workflow Orchestrator"
                onClick={() => navigate("/bms/workstate")}
                style={{
                  color: healthScore >= 90 ? "#22c55e" : healthScore >= 60 ? "#f59e0b" : "#ef4444",
                  borderColor: (healthScore >= 90 ? "#22c55e" : healthScore >= 60 ? "#f59e0b" : "#ef4444") + "44",
                }}
              >
                <span>{workStateConfig.icon}</span>
                <span>{healthScore}</span>
              </button>
              <button className="bms-topbar-btn" title="Notifications" onClick={() => navigate("/bms/notifications")}>
                {Icons.bell}
              </button>
              <button className="bms-topbar-btn" title="Profile" onClick={() => navigate("/bms/profile")}>
                {Icons.user}
              </button>

              {/* Menu Dropdown */}
              <div className="menu-container">
                <button
                  className="bms-topbar-btn"
                  title="Menu"
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                >
                  {Icons.menu}
                </button>
                {showMenu && (
                  <div className="menu-dropdown">
                    <button onClick={() => { navigate("/bms/profile"); setShowMenu(false); }}>
                      {Icons.user} <span>Profile</span>
                    </button>
                    <button onClick={() => { navigate("/bms/settings"); setShowMenu(false); }}>
                      {Icons.settings} <span>Settings</span>
                    </button>
                    <button onClick={() => { navigate("/bms/management"); setShowMenu(false); }}>
                      {Icons.management} <span>Management</span>
                    </button>
                    <button onClick={() => { navigate("/bms/workstate"); setShowMenu(false); }}>
                      {Icons.workflow} <span>Workflow Orchestrator</span>
                    </button>
                    <div className="menu-divider" />
                    <button className="danger" onClick={handleLogout}>
                      {Icons.logout} <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                className={`bms-topbar-ai ${showCopilot ? "active" : ""}`}
                title="AI Copilot"
                onClick={() => setShowCopilot(!showCopilot)}
              >
                {Icons.ai}
              </button>
            </div>
          </header>

          {/* Page Content */}
          <section className="bms-content">
            <Outlet />
          </section>

          {/* Footer */}
          <footer className="bms-footer">
            <div className="bms-watermark">
              <span className="bms-watermark-mark">{Icons.powerSmall}</span>
              <span className="bms-watermark-text">powerframe</span>
            </div>
          </footer>
        </main>
      </div>

      {/* AI Copilot */}
      <Copilot isOpen={showCopilot} onClose={() => setShowCopilot(false)} />
    </div>
  );
}

/* Icons */
const Icons = {
  rocket: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path d="M14 4c3.5 0 6 2.5 6 6-2.5 4-6.5 8-10.5 10.5-3.5 0-5.5-2-5.5-5.5C6 10.5 10 6.5 14 4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 14l-2 2M12 16l-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.5 8.5h.01" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  ),
  power: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M12 2v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 4.5C4.5 6.3 3 9 3 12c0 5 4 9 9 9s9-4 9-9c0-3-1.5-5.7-4-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  powerSmall: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path d="M12 2v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 4.5C4.5 6.3 3 9 3 12c0 5 4 9 9 9s9-4 9-9c0-3-1.5-5.7-4-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M3 11.5 21 3l-8.5 18-2.5-7-7-2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  checklist: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M9 6h12M9 12h12M9 18h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3.5 6.2 5 7.7 7.6 5.1M3.5 12.2 5 13.7 7.6 11.1M3.5 18.2 5 19.7 7.6 17.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M7 3v3M17 3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 7h16M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.8 16.8 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M3.5 6.5h6l2 2H20.5a1.5 1.5 0 0 1 1.5 1.5v9.5a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2V8a1.5 1.5 0 0 1 1.5-1.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  archive: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M4 7h16M6 7v14h12V7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 3h8l1 4H7l1-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 10.5v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 7.5h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  management: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  workflow: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <circle cx="5" cy="6" r="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="19" cy="6" r="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="5" cy="18" r="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="19" cy="18" r="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 6h10M7 18h10M5 8v8M19 8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M12 3 3 21h4l2-4h6l2 4h4L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 13h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  chevronUp: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M6 10l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* CSS */
const CSS = `
  :root {
    --sidebar-collapsed: 68px;
    --sidebar-expanded: 260px;
    --transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }

  .bms-root {
    min-height: 100vh;
    color: rgba(255,255,255,0.92);
    position: relative;
    overflow: hidden;
    background: radial-gradient(1200px 600px at 20% 20%, rgba(255,255,255,0.06), transparent 60%),
                linear-gradient(135deg, #070614 0%, #0a0619 35%, #1a0b3a 60%, #050514 100%);
  }

  .bms-bg {
    position: absolute;
    inset: -60px;
    background: linear-gradient(90deg, rgba(120,0,255,0.55), rgba(30,70,255,0.55));
    opacity: 0.9;
    z-index: 0;
    pointer-events: none;
  }

  .bms-shell {
    position: relative;
    z-index: 1;
    display: flex;
    min-height: 100vh;
    padding: 18px;
    gap: 18px;
  }

  /* Collapsible Sidebar */
  .bms-sidebar {
    position: relative;
    width: var(--sidebar-collapsed);
    min-width: var(--sidebar-collapsed);
    transition: width var(--transition), min-width var(--transition);
  }

  .bms-sidebar.expanded {
    width: var(--sidebar-expanded);
    min-width: var(--sidebar-expanded);
  }

  .bms-sidebar-inner {
    height: calc(100vh - 36px);
    border-radius: 20px;
    background: linear-gradient(180deg, rgba(35,35,45,0.62), rgba(18,18,25,0.62));
    border: 1px solid rgba(255,255,255,0.12);
    box-shadow: 0 14px 50px rgba(0,0,0,0.45);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 14px 10px;
  }

  /* Brand */
  .bms-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: 14px;
    cursor: pointer;
    transition: background 0.15s;
    overflow: hidden;
  }

  .bms-brand:hover {
    background: rgba(255,255,255,0.06);
  }

  .bms-brand-icon {
    width: 38px;
    height: 38px;
    min-width: 38px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .bms-brand-meta {
    opacity: 0;
    width: 0;
    overflow: hidden;
    white-space: nowrap;
    transition: opacity var(--transition), width var(--transition);
  }

  .bms-sidebar.expanded .bms-brand-meta {
    opacity: 1;
    width: auto;
  }

  .bms-brand-name { font-weight: 700; font-size: 13px; }
  .bms-brand-sub { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 2px; }

  /* Project Switcher */
  .project-switcher {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .project-switch-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: white;
    cursor: pointer;
    text-align: left;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
  }

  .project-switch-btn:hover { background: rgba(255,255,255,0.08); }
  .project-switch-btn.active { border-color: #52c41a; background: rgba(82,196,26,0.1); }
  .project-switch-btn.add { color: #52c41a; border-style: dashed; }

  .project-dot {
    width: 10px;
    height: 10px;
    min-width: 10px;
    border-radius: 4px;
  }

  /* Version/Progress */
  .bms-version {
    padding: 10px 8px;
    opacity: 0;
    height: 0;
    overflow: hidden;
    transition: opacity var(--transition), height var(--transition);
  }

  .bms-sidebar.expanded .bms-version {
    opacity: 1;
    height: auto;
  }

  .bms-version-row {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: rgba(255,255,255,0.5);
  }

  .bms-progress {
    margin-top: 6px;
    height: 4px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    overflow: hidden;
  }

  .bms-progress-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(255,255,255,0.75), rgba(130,180,255,0.8));
  }

  /* Navigation */
  .bms-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 10px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .bms-nav::-webkit-scrollbar { width: 4px; }
  .bms-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 999px; }

  .bms-nav-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 14px;
    border: 1px solid transparent;
    background: transparent;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    transition: all 0.15s;
    overflow: hidden;
  }

  .bms-nav-btn:hover {
    background: rgba(255,255,255,0.06);
    color: white;
  }

  .bms-nav-btn.is-active {
    background: rgba(120,140,255,0.12);
    border-color: rgba(140,160,255,0.4);
    color: white;
  }

  .nav-icon {
    min-width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-text {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    width: 0;
    overflow: hidden;
    transition: opacity var(--transition), width var(--transition);
  }

  .bms-sidebar.expanded .nav-text {
    opacity: 1;
    width: auto;
  }

  .bms-sidebar-footer {
    display: flex;
    gap: 6px;
    padding-top: 10px;
    border-top: 1px solid rgba(255,255,255,0.06);
    margin-top: 10px;
  }

  .bms-sidebar-footer .bms-nav-btn {
    flex: 1;
    justify-content: center;
    padding: 10px;
  }

  /* FAB */
  .bms-fab {
    position: absolute;
    right: -20px;
    bottom: 30px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22), transparent 55%), #2be35c;
    box-shadow: 0 12px 30px rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
  }

  .bms-fab:hover { transform: scale(1.08); }

  .bms-fab-plus {
    font-size: 28px;
    color: rgba(0,0,0,0.75);
  }

  /* Main */
  .bms-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* Top Bar */
  .bms-topbar {
    height: 64px;
    border-radius: 20px;
    background: linear-gradient(90deg, rgba(20,20,28,0.62), rgba(18,18,25,0.45));
    border: 1px solid rgba(255,255,255,0.14);
    box-shadow: 0 10px 28px rgba(0,0,0,0.35);
    display: flex;
    align-items: center;
    padding: 0 14px;
    gap: 14px;
    flex-shrink: 0;
  }

  .bms-topbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 240px;
  }

  .bms-topbar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.04);
  }

  .bms-topbar-logo-mark { display: flex; align-items: center; }
  .bms-topbar-logo-text { font-weight: 700; font-size: 13px; }
  .bms-topbar-title { font-weight: 800; font-size: 18px; }

  .bms-topbar-center {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 200px;
  }

  .bms-search-label { font-size: 13px; color: rgba(255,255,255,0.5); }

  .bms-search {
    position: relative;
    flex: 1;
    max-width: 400px;
  }

  .bms-search input {
    width: 100%;
    height: 38px;
    border-radius: 999px;
    padding: 0 40px 0 14px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(0,0,0,0.18);
    color: white;
    outline: none;
  }

  .bms-search input::placeholder { color: rgba(255,255,255,0.35); }

  .bms-search-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.5);
    pointer-events: none;
  }

  .bms-topbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .bms-topbar-btn {
    width: 40px;
    height: 40px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.86);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
  }

  .bms-topbar-btn:hover {
    background: rgba(255,255,255,0.08);
  }

  /* Menu Dropdown */
  .menu-container {
    position: relative;
  }

  .menu-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 200px;
    background: linear-gradient(180deg, rgba(30,30,40,0.95), rgba(20,20,28,0.95));
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 14px;
    padding: 8px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    z-index: 100;
  }

  .menu-dropdown button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: none;
    border-radius: 10px;
    background: transparent;
    color: rgba(255,255,255,0.85);
    cursor: pointer;
    font-size: 13px;
    text-align: left;
  }

  .menu-dropdown button:hover {
    background: rgba(255,255,255,0.08);
  }

  .menu-dropdown button.danger {
    color: #f87171;
  }

  .menu-dropdown button.danger:hover {
    background: rgba(248,113,113,0.15);
  }

  .menu-divider {
    height: 1px;
    background: rgba(255,255,255,0.1);
    margin: 6px 0;
  }

  .bms-topbar-ai {
    width: 46px;
    height: 46px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.18);
    background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04));
    color: rgba(255,255,255,0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .bms-topbar-ai:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3));
    border-color: rgba(99, 102, 241, 0.5);
    transform: scale(1.05);
  }

  .bms-topbar-ai.active {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-color: transparent;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  }

  /* Content */
  .bms-content {
    flex: 1;
    min-height: 0;
    border-radius: 22px;
    background: rgba(0,0,0,0.08);
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 10px 28px rgba(0,0,0,0.35);
    overflow: auto;
  }

  .bms-content::-webkit-scrollbar { width: 8px; }
  .bms-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 999px; }

  /* Footer */
  .bms-footer {
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .bms-watermark {
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: 0.35;
    color: rgba(255,255,255,0.75);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: lowercase;
  }

  /* Responsive */
  @media (max-width: 900px) {
    .bms-topbar-left { min-width: auto; }
    .bms-topbar-center { display: none; }
  }

  @media (max-width: 600px) {
    .bms-shell { padding: 10px; gap: 10px; }
    .bms-sidebar { display: none; }
    .bms-topbar { border-radius: 14px; padding: 0 10px; }
  }

  /* WorkState pill in sidebar */
  .bms-workstate-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    padding: 5px 10px;
    border-radius: 20px;
    border: 1px solid;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    background: transparent;
    transition: opacity 0.15s;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bms-workstate-pill:hover { opacity: 0.75; }

  /* Health Score chip in topbar */
  .bms-health-chip {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 20px;
    border: 1px solid;
    background: transparent;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .bms-health-chip:hover { opacity: 0.75; }
`;
