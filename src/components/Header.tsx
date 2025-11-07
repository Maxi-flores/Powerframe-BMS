import React from "react";
// src/components/Header.tsx
type HeaderProps = {
  pageName?: React.ReactNode; // ← SLOT for page title
  className?: string;
  style?: React.CSSProperties;
};

export default function Header({ pageName, className, style }: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", searchValue);
  };

  return (
    <header
      className={className}
      style={{
        ...style,
        position: "fixed",
        top: 0,
        left: 56,
        right: 0,
        height: 64,
        background: "#1E293B",
        borderBottom: "1px solid #334155",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        zIndex: 40,
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#F8FAFC",
      }}
    >
      {/* Page Name Slot */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          gap: 50,
        }}
      >
        <div
          style={{
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
        </div>
        {pageName || "Powerframe"} {/* ← FALLBACK */}
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{
          width: 380,
          marginLeft: 50,
          marginRight: 24,
          position: "relative",
        }}
      >
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search Planner"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setShowSearchDropdown(true)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 40px",
              background: "#334155",
              border: "none",
              borderRadius: 8,
              color: "#E2E8F0",
              fontSize: 14,
              outline: "none",
            }}
          />
          <SearchIcon
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              width: 18,
              height: 18,
              color: "#94A3B8",
            }}
          />
          <button
            type="button"
            onClick={() => setShowSearchDropdown(!showSearchDropdown)}
            style={{
              position: "absolute",
              right: -50,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <ChevronDown style={{ width: 16, height: 16, color: "#94A3B8" }} />
          </button>
        </div>

        {/* Search Dropdown */}
        {showSearchDropdown && (
          <div
            style={{
              position: "absolute",
              top: 50,
              left: 0,
              right: 0,
              background: "#1E293B",
              border: "1px solid #334155",
              borderRadius: 8,
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              zIndex: 50,
              padding: "12px 0",
            }}
            onClick={() => setShowSearchDropdown(false)}
          >
            {["All", "Tasks", "Projects", "Contacts", "Deals"].map((item) => (
              <div
                key={item}
                style={{
                  padding: "8px 16px",
                  color: "#E2E8F0",
                  cursor: "pointer",
                  fontSize: 14,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#334155")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Right Icons */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
        <IconButton icon="x" />
        <IconButton icon="refresh" />
        <div style={{ position: "relative" }}>
          <IconButton icon="bell" />
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              background: "#EF4444",
              borderRadius: "50%",
              border: "2px solid #1E293B",
            }}
          />
        </div>
        <div style={{ position: "relative" }}>
          <IconButton icon="dots" onClick={() => setShowMenu(!showMenu)} />
          {showMenu && <MenuDropdown onClose={() => setShowMenu(false)} />}
        </div>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowAvatar(!showAvatar)}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              overflow: "hidden",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="User"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </button>
          {showAvatar && <AvatarDropdown onClose={() => setShowAvatar(false)} />}
        </div>
      </div>
    </header>
  );
}

// ──────────────────────────────────────
// Reusable Components (unchanged)
function IconButton({ icon, onClick }: { icon: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 8,
        borderRadius: 8,
        color: "#E2E8F0",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#334155")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      <Icon name={icon} style={{ width: 20, height: 20 }} />
    </button>
  );
}

function MenuDropdown({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={onClose} />
      <div
        style={{
          position: "absolute",
          top: 48,
          right: 0,
          width: 200,
          background: "#1E293B",
          border: "1px solid #334155",
          borderRadius: 8,
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          zIndex: 50,
        }}
      >
        <MenuItem icon="grid" label="Widgets" />
        <MenuItem icon="calendar" label="Agenda" />
        <MenuItem icon="settings" label="Settings" />
      </div>
    </>
  );
}

function AvatarDropdown({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={onClose} />
      <div
        style={{
          position: "absolute",
          top: 48,
          right: 0,
          width: 220,
          background: "#1E293B",
          border: "1px solid #334155",
          borderRadius: 8,
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          zIndex: 50,
        }}
      >
        <div style={{ padding: 16, borderBottom: "1px solid #334155" }}>
          <div style={{ fontWeight: 600, color: "#F8FAFC" }}>John Doe</div>
          <div style={{ fontSize: 13, color: "#94A3B8" }}>john@powerframe.com</div>
        </div>
        <MenuItem icon="user" label="Manage Profile" />
        <MenuItem icon="building" label="Business Account" />
        <MenuItem icon="sliders" label="Customize Account" />
        <div style={{ height: 1, background: "#334155", margin: "8px 0" }} />
        <MenuItem icon="log-out" label="Sign Out" danger />
      </div>
    </>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        background: "none",
        border: "none",
        textAlign: "left",
        color: danger ? "#EF4444" : "#E2E8F0",
        cursor: "pointer",
        fontSize: 14,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = danger ? "rgba(239,68,68,0.1)" : "#334155")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      <Icon name={icon} style={{ width: 18, height: 18 }} />
      {label}
    </button>
  );
}

// ──────────────────────────────────────
// SVG Icons (unchanged)
function Icon({ name, ...props }: { name: string; [k: string]: any }) {
  const icons: Record<string, React.ReactNode> = {
    x: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    refresh: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    bell: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
    dots: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
        />
      </svg>
    ),
    grid: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    calendar: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    settings: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    user: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    building: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    sliders: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    ),
    "log-out": (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    ),
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

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}