import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Settings() {
  const {
    theme,
    setTheme,
    themes,
    currentTheme,
    customBg,
    setCustomBg,
    customAccent,
    setCustomAccent,
    bgPresets,
  } = useTheme();

  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    autoSave: true,
    compactMode: false,
  });

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState(customAccent || "#7c3aed");

  function updateSetting(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  function applyCustomAccent() {
    setCustomAccent(customColor);
    setShowColorPicker(false);
  }

  function resetTheme() {
    setTheme("default");
    setCustomBg(null);
    setCustomAccent(null);
  }

  return (
    <div className="page-container">
      <style>{css}</style>

      <div className="page-header">
        <h1>Settings</h1>
        <p className="page-subtitle">Configure your dashboard preferences</p>
      </div>

      <div className="settings-grid">
        {/* Theme Selection */}
        <div className="settings-section">
          <div className="section-header">
            <h3>Theme</h3>
            <button className="btn-reset" onClick={resetTheme}>Reset to Default</button>
          </div>

          <div className="theme-grid">
            {Object.entries(themes).map(([key, t]) => (
              <button
                key={key}
                className={`theme-card ${theme === key && !customBg ? "active" : ""}`}
                onClick={() => { setTheme(key); setCustomBg(null); }}
              >
                <div
                  className="theme-preview"
                  style={{ background: `linear-gradient(135deg, ${t.bg1}, ${t.bg2})` }}
                >
                  <div className="theme-accent" style={{ background: t.accent }} />
                </div>
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Background */}
        <div className="settings-section">
          <h3>Custom Background</h3>
          <p className="section-desc">Choose a gradient or solid color background</p>

          <div className="bg-presets">
            {bgPresets.map(preset => (
              <button
                key={preset.id}
                className={`bg-preset ${customBg === preset.value ? "active" : ""}`}
                style={{ background: preset.value }}
                onClick={() => setCustomBg(preset.value)}
              />
            ))}
            <button
              className={`bg-preset clear ${!customBg ? "active" : ""}`}
              onClick={() => setCustomBg(null)}
            >
              ✕
            </button>
          </div>

          <div className="custom-bg-input">
            <label>Custom CSS Background</label>
            <input
              type="text"
              placeholder="e.g., linear-gradient(135deg, #667eea, #764ba2)"
              value={customBg || ""}
              onChange={e => setCustomBg(e.target.value || null)}
            />
          </div>
        </div>

        {/* Accent Color */}
        <div className="settings-section">
          <h3>Accent Color</h3>
          <p className="section-desc">Customize the accent color for buttons and highlights</p>

          <div className="accent-colors">
            {["#7c3aed", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4", "#84cc16"].map(color => (
              <button
                key={color}
                className={`accent-btn ${(customAccent || currentTheme.accent) === color ? "active" : ""}`}
                style={{ background: color }}
                onClick={() => setCustomAccent(color)}
              />
            ))}
            <button
              className="accent-btn custom"
              onClick={() => setShowColorPicker(true)}
              style={{ background: customAccent || "#666" }}
            >
              +
            </button>
          </div>

          {showColorPicker && (
            <div className="color-picker-inline">
              <input
                type="color"
                value={customColor}
                onChange={e => setCustomColor(e.target.value)}
              />
              <input
                type="text"
                value={customColor}
                onChange={e => setCustomColor(e.target.value)}
                placeholder="#7c3aed"
              />
              <button className="btn-apply" onClick={applyCustomAccent}>Apply</button>
              <button className="btn-cancel-sm" onClick={() => setShowColorPicker(false)}>×</button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <h3>Notifications</h3>
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Push Notifications</span>
              <span className="setting-desc">Receive browser notifications</span>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.notifications} onChange={e => updateSetting("notifications", e.target.checked)} />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Email Alerts</span>
              <span className="setting-desc">Get important updates via email</span>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.emailAlerts} onChange={e => updateSetting("emailAlerts", e.target.checked)} />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        {/* Data & Storage */}
        <div className="settings-section">
          <h3>Data & Storage</h3>
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Auto-save</span>
              <span className="setting-desc">Automatically save changes</span>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.autoSave} onChange={e => updateSetting("autoSave", e.target.checked)} />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Compact Mode</span>
              <span className="setting-desc">Use smaller UI elements</span>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.compactMode} onChange={e => updateSetting("compactMode", e.target.checked)} />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Clear Cache</span>
              <span className="setting-desc">Remove temporary data</span>
            </div>
            <button className="btn-secondary">Clear</button>
          </div>
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-label">Export Data</span>
              <span className="setting-desc">Download all your data</span>
            </div>
            <button className="btn-secondary">Export</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const css = `
.page-container { padding: 30px; color: white; overflow-y: auto; }
.page-header { margin-bottom: 30px; }
.page-header h1 { margin: 0; font-size: 28px; }
.page-subtitle { color: rgba(255,255,255,0.6); margin: 5px 0 0; }

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
}

.settings-section {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 { margin: 0; }

.settings-section h3 {
  margin: 0 0 16px;
  font-size: 16px;
  color: rgba(255,255,255,0.9);
}

.section-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  margin: -8px 0 16px;
}

.btn-reset {
  padding: 8px 16px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  font-size: 12px;
}

.btn-reset:hover { background: rgba(255,255,255,0.1); }

/* Theme Grid */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.theme-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255,255,255,0.04);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-card:hover {
  background: rgba(255,255,255,0.08);
}

.theme-card.active {
  border-color: #52c41a;
  background: rgba(82,196,26,0.1);
}

.theme-preview {
  width: 100%;
  height: 60px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.theme-accent {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid rgba(255,255,255,0.3);
}

.theme-card span {
  font-size: 12px;
  color: rgba(255,255,255,0.8);
}

/* Background Presets */
.bg-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.bg-preset {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;
}

.bg-preset:hover { transform: scale(1.05); }

.bg-preset.active {
  border-color: #52c41a;
  box-shadow: 0 0 0 2px rgba(82,196,26,0.3);
}

.bg-preset.clear {
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.5);
  font-size: 18px;
}

.custom-bg-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.custom-bg-input label {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
}

.custom-bg-input input {
  padding: 12px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  color: white;
  font-size: 13px;
}

/* Accent Colors */
.accent-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.accent-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s;
}

.accent-btn:hover { transform: scale(1.1); }

.accent-btn.active {
  border-color: white;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.3);
}

.accent-btn.custom {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 300;
}

.color-picker-inline {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 12px;
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
}

.color-picker-inline input[type="color"] {
  width: 50px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
}

.color-picker-inline input[type="text"] {
  flex: 1;
  padding: 10px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  color: white;
  font-family: monospace;
}

.btn-apply {
  padding: 10px 20px;
  background: #52c41a;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: 500;
}

.btn-cancel-sm {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  font-size: 18px;
}

/* Setting Rows */
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.setting-row:last-child { border-bottom: none; }

.setting-info { flex: 1; }
.setting-label { display: block; font-size: 14px; font-weight: 500; }
.setting-desc { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px; }

.btn-secondary {
  padding: 10px 20px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  color: white;
  cursor: pointer;
}

.toggle {
  position: relative;
  width: 50px;
  height: 28px;
}

.toggle input { opacity: 0; width: 0; height: 0; }

.toggle-slider {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.15);
  border-radius: 28px;
  cursor: pointer;
  transition: 0.3s;
}

.toggle-slider::before {
  content: "";
  position: absolute;
  width: 22px;
  height: 22px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle input:checked + .toggle-slider { background: #52c41a; }
.toggle input:checked + .toggle-slider::before { transform: translateX(22px); }
`;
