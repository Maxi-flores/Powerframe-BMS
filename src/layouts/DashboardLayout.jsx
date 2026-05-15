import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useProjects } from "../context/ProjectContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import Copilot from "../components/Copilot.jsx";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeProject, projects, switchProject, activeCandidate, clearActiveCandidate } = useProjects();
  const { currentTheme } = useTheme();

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showProjectSwitcher, setShowProjectSwitcher] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [search, setSearch] = useState("");

  const navItems = [
    { key: "Dashboard", path: "/gms", icon: Icons.home },
    { key: "Out", path: "/gms/out", icon: Icons.send },
    { key: "Tasks", path: "/gms/tasks", icon: Icons.checklist },
    { key: "Plans", path: "/gms/plans", icon: Icons.calendar },
    { key: "Web search", path: "/gms/search", icon: Icons.search },
    { key: "Projects", path: "/gms/projects", icon: Icons.folder },
    { key: "Bestanden", path: "/gms/files", icon: Icons.archive },
    { key: "Info", path: "/gms/info", icon: Icons.info },
  ];

  const currentPath = location.pathname;
  const activeKey = navItems.find(item =>
    item.path === currentPath || (item.path !== "/gms" && currentPath.startsWith(item.path))
  )?.key || "Dashboard";

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/gms-login");
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
    .gms-root {
      background: ${currentTheme.customBg || currentTheme.gradient};
    }
    .gms-bg {
      background: linear-gradient(90deg, ${currentTheme.bg1}, ${currentTheme.bg2});
    }
    .gms-nav-btn.is-active {
      background: ${currentTheme.accent}22;
      border-color: ${currentTheme.accent}66;
    }
    .gms-fab {
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.22), transparent 55%), ${currentTheme.accent};
    }
  `;

  return (
    <div className="gms-root">
      <style>{CSS}</style>
      <style>{dynamicStyles}</style>
      <div className="gms-bg" />

      <div className="gms-shell">
        {/* Collapsible Sidebar */}
        <aside
          className={`gms-sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => { setSidebarExpanded(false); setShowProjectSwitcher(false); }}
        >
          <div className="gms-sidebar-inner">
            {/* Brand */}
            <div
              className="gms-brand"
              onClick={() => setShowProjectSwitcher(!showProjectSwitcher)}
            >
              <div className="gms-brand-icon" style={{ background: activeProject?.color }}>
                {Icons.rocket}
              </div>
              <div className="gms-brand-meta">
                <div className="gms-brand-name">{activeProject?.name || "PowerFrame"}</div>
                <div className="gms-brand-sub">GMS • V1</div>
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
                  onClick={() => { navigate("/gms/projects"); setShowProjectSwitcher(false); }}
                >
                  + New Project
                </button>
              </div>
            )}

            {/* Progress */}
            <div className="gms-version">
              <div className="gms-version-row">
                <span className="gms-version-label">V1</span>
                <span className="gms-version-val">58%</span>
              </div>
              <div className="gms-progress">
                <div className="gms-progress-fill" style={{ width: "58%" }} />
              </div>
            </div>

            {/* Navigation */}
            <nav className="gms-nav">
              {navItems.map((it) => (
                <button
                  key={it.key}
                  className={`gms-nav-btn ${activeKey === it.key ? "is-active" : ""}`}
                  onClick={() => navigate(it.path)}
                  title={it.key}
                >
                  <span className="nav-icon">{it.icon}</span>
                  <span className="nav-text">{it.key}</span>
                </button>
              ))}
            </nav>

            {/* Bottom controls */}
            <div className="gms-sidebar-footer">
              <button className="gms-nav-btn" title="Scroll up">{Icons.chevronUp}</button>
              <button className="gms-nav-btn" title="Scroll down">{Icons.chevronDown}</button>
            </div>
          </div>

          {/* FAB */}
          <button className="gms-fab" onClick={() => navigate("/gms/projects")} title="New Project">
            <span className="gms-fab-plus">+</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="gms-main">
          {/* Semantic Bridge Banner */}
          {activeCandidate && (
            <div className="gms-bridge-banner">
              <div className="gms-bridge-banner-left">
                <span className="gms-bridge-label">⚡ Bridge Lab</span>
                <span className="gms-bridge-status">
                  {activeCandidate.status?.meaning || "—"}
                </span>
                {activeCandidate.candidate && (
                  <span className="gms-bridge-dot" title="UnityAction Candidate Instantiated" />
                )}
                {activeCandidate.candidate && (
                  <span className="gms-bridge-candidate-text">
                    UnityAction Candidate Instantiated
                  </span>
                )}
              </div>
              <button
                className="gms-bridge-close"
                onClick={clearActiveCandidate}
                title="Dismiss"
              >
                ×
              </button>
            </div>
          )}

          {/* Top Bar */}
          <header className="gms-topbar">
            <div className="gms-topbar-left">
              <div className="gms-topbar-logo">
                <span className="gms-topbar-logo-mark">{Icons.power}</span>
                <span className="gms-topbar-logo-text">PowerStarter</span>
              </div>
              <div className="gms-topbar-title">| {activeKey}</div>
            </div>

            <div className="gms-topbar-center">
              <label className="gms-search-label">Zoeken:</label>
              <div className="gms-search">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search modules, tasks, projects…"
                />
                <span className="gms-search-icon">{Icons.search}</span>
              </div>
            </div>

            <div className="gms-topbar-right">
              <button className="gms-topbar-btn" title="Notifications" onClick={() => navigate("/gms/notifications")}>
                {Icons.bell}
              </button>
              <button className="gms-topbar-btn" title="Profile" onClick={() => navigate("/gms/profile")}>
                {Icons.user}
              </button>

              {/* Menu Dropdown */}
              <div className="menu-container">
                <button
                  className="gms-topbar-btn"
                  title="Menu"
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                >
                  {Icons.menu}
                </button>
                {showMenu && (
                  <div className="menu-dropdown">
                    <button onClick={() => { navigate("/gms/profile"); setShowMenu(false); }}>
                      {Icons.user} <span>Profile</span>
                    </button>
                    <button onClick={() => { navigate("/gms/settings"); setShowMenu(false); }}>
                      {Icons.settings} <span>Settings</span>
                    </button>
                    <button onClick={() => { navigate("/gms/management"); setShowMenu(false); }}>
                      {Icons.management} <span>Management</span>
                    </button>
                    <div className="menu-divider" />
                    <button className="danger" onClick={handleLogout}>
                      {Icons.logout} <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                className={`gms-topbar-ai ${showCopilot ? "active" : ""}`}
                title="AI Copilot"
                onClick={() => setShowCopilot(!showCopilot)}
              >
                {Icons.ai}
              </button>
            </div>
          </header>

          {/* Page Content */}
          <section className="gms-content">
            <Outlet />
          </section>

          {/* Footer */}
          <footer className="gms-footer">
            <div className="gms-watermark">
              <span className="gms-watermark-mark">{Icons.powerSmall}</span>
              <span className="gms-watermark-text">powerframe</span>
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

  .gms-root {
    min-height: 100vh;
    color: rgba(255,255,255,0.92);
    position: relative;
    overflow: hidden;
    background: radial-gradient(1200px 600px at 20% 20%, rgba(255,255,255,0.06), transparent 60%),
                linear-gradient(135deg, #070614 0%, #0a0619 35%, #1a0b3a 60%, #050514 100%);
  }

  .gms-bg {
    position: absolute;
    inset: -60px;
    background: linear-gradient(90deg, rgba(120,0,255,0.55), rgba(30,70,255,0.55));
    opacity: 0.9;
    z-index: 0;
    pointer-events: none;
  }

  .gms-shell {
    position: relative;
    z-index: 1;
    display: flex;
    min-height: 100vh;
    padding: 18px;
    gap: 18px;
  }

  /* Collapsible Sidebar */
  .gms-sidebar {
    position: relative;
    width: var(--sidebar-collapsed);
    min-width: var(--sidebar-collapsed);
    transition: width var(--transition), min-width var(--transition);
  }

  .gms-sidebar.expanded {
    width: var(--sidebar-expanded);
    min-width: var(--sidebar-expanded);
  }

  .gms-sidebar-inner {
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
  .gms-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: 14px;
    cursor: pointer;
    transition: background 0.15s;
    overflow: hidden;
  }

  .gms-brand:hover {
    background: rgba(255,255,255,0.06);
  }

  .gms-brand-icon {
    width: 38px;
    height: 38px;
    min-width: 38px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .gms-brand-meta {
    opacity: 0;
    width: 0;
    overflow: hidden;
    white-space: nowrap;
    transition: opacity var(--transition), width var(--transition);
  }

  .gms-sidebar.expanded .gms-brand-meta {
    opacity: 1;
    width: auto;
  }

  .gms-brand-name { font-weight: 700; font-size: 13px; }
  .gms-brand-sub { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 2px; }

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
  .gms-version {
    padding: 10px 8px;
    opacity: 0;
    height: 0;
    overflow: hidden;
    transition: opacity var(--transition), height var(--transition);
  }

  .gms-sidebar.expanded .gms-version {
    opacity: 1;
    height: auto;
  }

  .gms-version-row {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: rgba(255,255,255,0.5);
  }

  .gms-progress {
    margin-top: 6px;
    height: 4px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    overflow: hidden;
  }

  .gms-progress-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(255,255,255,0.75), rgba(130,180,255,0.8));
  }

  /* Navigation */
  .gms-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 10px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .gms-nav::-webkit-scrollbar { width: 4px; }
  .gms-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 999px; }

  .gms-nav-btn {
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

  .gms-nav-btn:hover {
    background: rgba(255,255,255,0.06);
    color: white;
  }

  .gms-nav-btn.is-active {
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

  .gms-sidebar.expanded .nav-text {
    opacity: 1;
    width: auto;
  }

  .gms-sidebar-footer {
    display: flex;
    gap: 6px;
    padding-top: 10px;
    border-top: 1px solid rgba(255,255,255,0.06);
    margin-top: 10px;
  }

  .gms-sidebar-footer .gms-nav-btn {
    flex: 1;
    justify-content: center;
    padding: 10px;
  }

  /* FAB */
  .gms-fab {
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

  .gms-fab:hover { transform: scale(1.08); }

  .gms-fab-plus {
    font-size: 28px;
    color: rgba(0,0,0,0.75);
  }

  /* Main */
  .gms-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* Top Bar */
  .gms-topbar {
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

  .gms-topbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 240px;
  }

  .gms-topbar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.04);
  }

  .gms-topbar-logo-mark { display: flex; align-items: center; }
  .gms-topbar-logo-text { font-weight: 700; font-size: 13px; }
  .gms-topbar-title { font-weight: 800; font-size: 18px; }

  .gms-topbar-center {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 200px;
  }

  .gms-search-label { font-size: 13px; color: rgba(255,255,255,0.5); }

  .gms-search {
    position: relative;
    flex: 1;
    max-width: 400px;
  }

  .gms-search input {
    width: 100%;
    height: 38px;
    border-radius: 999px;
    padding: 0 40px 0 14px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(0,0,0,0.18);
    color: white;
    outline: none;
  }

  .gms-search input::placeholder { color: rgba(255,255,255,0.35); }

  .gms-search-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.5);
    pointer-events: none;
  }

  .gms-topbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .gms-topbar-btn {
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

  .gms-topbar-btn:hover {
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

  .gms-topbar-ai {
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

  .gms-topbar-ai:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3));
    border-color: rgba(99, 102, 241, 0.5);
    transform: scale(1.05);
  }

  .gms-topbar-ai.active {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-color: transparent;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  }

  /* Content */
  .gms-content {
    flex: 1;
    min-height: 0;
    border-radius: 22px;
    background: rgba(0,0,0,0.08);
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 10px 28px rgba(0,0,0,0.35);
    overflow: auto;
  }

  .gms-content::-webkit-scrollbar { width: 8px; }
  .gms-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 999px; }

  /* Footer */
  .gms-footer {
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .gms-watermark {
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
    .gms-topbar-left { min-width: auto; }
    .gms-topbar-center { display: none; }
  }

  @media (max-width: 600px) {
    .gms-shell { padding: 10px; gap: 10px; }
    .gms-sidebar { display: none; }
    .gms-topbar { border-radius: 14px; padding: 0 10px; }
  }

  /* Semantic Bridge Banner */
  .gms-bridge-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 18px;
    border-radius: 16px;
    background: rgba(88, 28, 135, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(167, 139, 250, 0.3);
    flex-shrink: 0;
    gap: 12px;
  }

  .gms-bridge-banner-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    overflow: hidden;
  }

  .gms-bridge-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #c4b5fd;
    white-space: nowrap;
  }

  .gms-bridge-status {
    font-size: 12px;
    color: rgba(255,255,255,0.7);
    font-family: ui-monospace, monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .gms-bridge-dot {
    width: 9px;
    height: 9px;
    min-width: 9px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 6px #4ade80, 0 0 12px #4ade8066;
    animation: gms-pulse 1.4s ease-in-out infinite;
  }

  .gms-bridge-candidate-text {
    font-size: 11px;
    color: #4ade80;
    white-space: nowrap;
    font-weight: 600;
  }

  .gms-bridge-close {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid rgba(167,139,250,0.3);
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s;
  }

  .gms-bridge-close:hover {
    background: rgba(248,113,113,0.2);
    color: #f87171;
  }

  @keyframes gms-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.2); }
  }
`;
