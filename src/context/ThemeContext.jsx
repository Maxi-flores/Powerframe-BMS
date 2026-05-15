import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();
const THEME_KEY = "gms_theme";
const LEGACY_THEME_KEY = "bms_theme";

const THEMES = {
  default: {
    name: "Default Purple",
    bg1: "rgba(120,0,255,0.55)",
    bg2: "rgba(30,70,255,0.55)",
    gradient: "linear-gradient(135deg, #070614 0%, #0a0619 35%, #1a0b3a 60%, #050514 100%)",
    accent: "#7c3aed",
  },
  ocean: {
    name: "Ocean Blue",
    bg1: "rgba(0,100,180,0.55)",
    bg2: "rgba(0,180,200,0.55)",
    gradient: "linear-gradient(135deg, #041420 0%, #062030 35%, #0a3045 60%, #031018 100%)",
    accent: "#0ea5e9",
  },
  forest: {
    name: "Forest Green",
    bg1: "rgba(0,150,80,0.55)",
    bg2: "rgba(50,180,100,0.55)",
    gradient: "linear-gradient(135deg, #040f0a 0%, #061a10 35%, #0a2818 60%, #030a06 100%)",
    accent: "#22c55e",
  },
  sunset: {
    name: "Sunset Orange",
    bg1: "rgba(255,100,50,0.55)",
    bg2: "rgba(255,50,100,0.55)",
    gradient: "linear-gradient(135deg, #1a0a04 0%, #2a1008 35%, #3a1510 60%, #140604 100%)",
    accent: "#f97316",
  },
  rose: {
    name: "Rose Pink",
    bg1: "rgba(220,50,150,0.55)",
    bg2: "rgba(150,50,200,0.55)",
    gradient: "linear-gradient(135deg, #140610 0%, #200a18 35%, #2a1025 60%, #0f0408 100%)",
    accent: "#ec4899",
  },
  midnight: {
    name: "Midnight Dark",
    bg1: "rgba(30,30,50,0.55)",
    bg2: "rgba(20,20,40,0.55)",
    gradient: "linear-gradient(135deg, #08080c 0%, #0c0c14 35%, #101018 60%, #06060a 100%)",
    accent: "#6366f1",
  },
  ember: {
    name: "Ember Red",
    bg1: "rgba(200,50,50,0.55)",
    bg2: "rgba(150,30,80,0.55)",
    gradient: "linear-gradient(135deg, #1a0606 0%, #2a0a0a 35%, #3a1010 60%, #140404 100%)",
    accent: "#ef4444",
  },
  gold: {
    name: "Golden Hour",
    bg1: "rgba(200,150,50,0.55)",
    bg2: "rgba(180,100,30,0.55)",
    gradient: "linear-gradient(135deg, #141008 0%, #1e180c 35%, #2a2010 60%, #0f0c06 100%)",
    accent: "#eab308",
  },
};

const CUSTOM_BG_PRESETS = [
  { id: "gradient1", type: "gradient", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { id: "gradient2", type: "gradient", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { id: "gradient3", type: "gradient", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { id: "gradient4", type: "gradient", value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { id: "gradient5", type: "gradient", value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { id: "gradient6", type: "gradient", value: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" },
  { id: "solid1", type: "solid", value: "#1a1a2e" },
  { id: "solid2", type: "solid", value: "#16213e" },
  { id: "solid3", type: "solid", value: "#1f1f1f" },
  { id: "solid4", type: "solid", value: "#0f172a" },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved =
      localStorage.getItem(THEME_KEY) ?? localStorage.getItem(LEGACY_THEME_KEY);
    return saved || "default";
  });

  const [customBg, setCustomBg] = useState(() => {
    const saved = localStorage.getItem("gms_custom_bg");
    return saved || null;
  });

  const [customAccent, setCustomAccent] = useState(() => {
    const saved = localStorage.getItem("gms_custom_accent");
    return saved || null;
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (customBg) {
      localStorage.setItem("gms_custom_bg", customBg);
    } else {
      localStorage.removeItem("gms_custom_bg");
    }
  }, [customBg]);

  useEffect(() => {
    if (customAccent) {
      localStorage.setItem("gms_custom_accent", customAccent);
    } else {
      localStorage.removeItem("gms_custom_accent");
    }
  }, [customAccent]);

  const currentTheme = THEMES[theme] || THEMES.default;

  const effectiveTheme = {
    ...currentTheme,
    ...(customBg && { customBg }),
    ...(customAccent && { accent: customAccent }),
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themes: THEMES,
        currentTheme: effectiveTheme,
        customBg,
        setCustomBg,
        customAccent,
        setCustomAccent,
        bgPresets: CUSTOM_BG_PRESETS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
