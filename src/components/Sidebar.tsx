// src/components/Sidebar.tsx
import { useState, useRef, useEffect, forwardRef, createContext, useContext, StrictMode } from "react";
import { useLocation } from "react-router-dom";

const COLLAPSED_WIDTH = 75; // ~40% of 280px
const EXPANDED_WIDTH = 280;

type SidebarProps = {
  className?: string;
  style?: React.CSSProperties;
};

const navItems = [
  { label: "Dashboard", icon: "home", path: "/dashboard" },
  { label: "Contacts", icon: "users", path: "/contacts" },
  { label: "Companies", icon: "building", path: "/companies" },
  { label: "Deals", icon: "handshake", path: "/deals" },
  { label: "Tasks", icon: "checklist", path: "/tasks" },
  { label: "Reports", icon: "chart", path: "/reports" },
];

const bottomItems = [
  { label: "Settings", icon: "cog", path: "/settings" },
  { label: "Help & Support", icon: "help", path: "/help" },
];

export default function Sidebar({ className, style }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={className}
      style={{
        ...style,
        width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        background: "#1E293B",
        borderRight: "1px solid #334155",
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        zIndex: 50,
        transition: "width 0.3s ease",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "24px 16px",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: "#3B82F6",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "white",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          P
        </div>
        {isExpanded && (
          <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#F8FAFC", whiteSpace: "nowrap" }}>
            Powerframe - CRM
          </h1>
        )}
      </div>

      {/* Search */}
      {isExpanded && (
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ padding: "0 16px", marginBottom: 24, width: "calc(100% - 32px)" }}
        >
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px 8px 32px",
                background: "#334155",
                border: "none",
                borderRadius: 8,
                color: "#E2E8F0",
                fontSize: 13,
                outline: "none",
              }}
            />
            <SearchIcon
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                width: 14,
                height: 14,
                color: "#94A3B8",
              }}
            />
          </div>
        </form>
      )}

      {/* Main Nav */}
      <nav style={{ flex: 1, padding: "0 8px" }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <a
              key={item.label}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(true); // Expand on click
                // Optional: navigate via router
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px",
                margin: "4px 8px",
                borderRadius: 8,
                background: active ? "#3B82F6" : "transparent",
                color: active ? "white" : "#94A3B8",
                textDecoration: "none",
                fontWeight: active ? 600 : 400,
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "#334155";
                  e.currentTarget.style.color = "#E2E8F0";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#94A3B8";
                }
              }}
            >
              <Icon name={item.icon} style={{ width: 20, height: 20, flexShrink: 0 }} />
              {isExpanded && <span>{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: "1px solid #334155", padding: "16px 8px 0" }}>
        {bottomItems.map((item) => {
          const active = isActive(item.path);
          return (
            <a
              key={item.label}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px",
                margin: "4px 8px",
                borderRadius: 8,
                background: active ? "#3B82F6" : "transparent",
                color: active ? "white" : "#94A3B8",
                textDecoration: "none",
                fontWeight: 400,
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              <Icon name={item.icon} style={{ width: 20, height: 20, flexShrink: 0 }} />
              {isExpanded && <span>{item.label}</span>}
            </a>
          );
        })}
      </div>
    </aside>
  );
}

/* ────────────────────────────── SVG Icons ────────────────────────────── */
function Icon({ name, ...props }: { name: string; [key: string]: any }) {
  const icons: Record<string, JSX.Element> = {
    home: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    users: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H9a3 3 0 01-3-3v-1m12 4H6m6-9a4 4 0 100-8 4 4 0 000 8z" /></svg>,
    building: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    handshake: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14h.01M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    checklist: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
    chart: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    cog: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    help: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 3C6.972 3 6 3.972 6 5.228v13.544C6 20.028 6.972 21 8.228 21h7.544C17.028 21 18 20.028 18 18.772V5.228C18 3.972 17.028 3 15.772 3H8.228zM12 17.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 13.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /></svg>,
  };
  return icons[name] || null;
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}