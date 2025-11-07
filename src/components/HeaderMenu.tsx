import React, { useState, useEffect, useRef, forwardRef, createContext, useContext } from "react";
// src/components/HeaderMenu.tsx
import { Bell, Search, User, ChevronDown, LogOut } from "lucide-react";

type HeaderMenuProps = {
  className?: string;
  style?: React.CSSProperties;
  onSearch?: (query: string) => void;
  notifications?: number;
  userName?: string;
  userAvatar?: string;
};

export default function HeaderMenu({ className, style, onSearch, notifications = 3, userName = "John Doe", userAvatar = "https://via.placeholder.com/40" }: HeaderMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <div className={className} style={{ ...style, display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
      {/* Left: Breadcrumbs or Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600, color: "#F8FAFC" }}>Dashboard</h2>
      </div>

      {/* Right: Search + Icons + User */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Search */}
        <form onSubmit={handleSearch} style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "8px 12px 8px 36px",
              background: "#334155",
              border: "none",
              borderRadius: 8,
              color: "#E2E8F0",
              width: "200px",
              outline: "none",
            }}
          />
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
        </form>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <Bell size={20} style={{ color: "#94A3B8", cursor: "pointer" }} />
          {notifications > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "#EF4444", borderRadius: "50%", width: 12, height: 12, fontSize: 10, color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>{notifications}</span>}
        </div>

        {/* User Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}
          >
            <img src={userAvatar} alt={userName} style={{ width: 32, height: 32, borderRadius: "50%" }} />
            <span style={{ fontWeight: 500 }}>{userName.split(" ")[0]}</span>
            <ChevronDown size={16} />
          </button>
          {userDropdownOpen && (
            <div style={{ position: "absolute", top: "100%", right: 0, background: "#1E293B", border: "1px solid #334155", borderRadius: 8, minWidth: 160, boxShadow: "0 4px 6px rgba(0,0,0,0.1)", zIndex: 1000 }}>
              <button style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "12px 16px", background: "none", border: "none", textAlign: "left", color: "#F8FAFC", cursor: "pointer", transition: "background 0.2s" }} onClick={() => console.log("Profile")}>
                <User size={16} />
                Profile
              </button>
              <button style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "12px 16px", background: "none", border: "none", textAlign: "left", color: "#F8FAFC", cursor: "pointer", transition: "background 0.2s" }} onClick={() => console.log("Settings")}>
                <LucideSettings size={16} />
                Settings
              </button>
              <button style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "12px 16px", background: "none", border: "none", textAlign: "left", color: "#EF4444", cursor: "pointer", transition: "background 0.2s" }} onClick={() => console.log("Logout")}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}