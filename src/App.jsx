import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectProvider } from "./context/ProjectContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { runPowerframeHandshake } from "./auth/powerframeHandshake.js";

// No local login pages - Powerframe Hub handles all authentication

// Layout
import DashboardLayout from "./layouts/DashboardLayout.jsx";

// Dashboard Pages
import Overview from "./pages/Overview.jsx";
import Projects from "./pages/Projects.jsx";
import Tasks from "./pages/Tasks.jsx";
import Plans from "./pages/Plans.jsx";
import Out from "./pages/Out.jsx";
import WebSearch from "./pages/WebSearch.jsx";
import Files from "./pages/Files.jsx";
import Info from "./pages/Info.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import Management from "./pages/Management.jsx";

// Run SSO handshake at module level
runPowerframeHandshake();

function PrivateRoute({ children }) {
  const stored = localStorage.getItem("powerframe_user");

  if (!stored) {
    // TODO: In production, replace local dev fallback with redirect to Powerframe Hub SSO.
    // For local development, create a temporary session to allow instant app loading.
    const devSession = {
      id: "dev-user",
      email: "dev@powerframe.local",
      name: "Powerframe Dev User",
      provider: "local-dev",
      token: "dev-token",
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    };
    localStorage.setItem("powerframe_user", JSON.stringify(devSession));
    return children;
  }

  try {
    const pf = JSON.parse(stored);
    if (pf.expiresAt < Date.now()) {
      // Session expired in local dev: recreate dev session
      const devSession = {
        id: "dev-user",
        email: "dev@powerframe.local",
        name: "Powerframe Dev User",
        provider: "local-dev",
        token: "dev-token",
        expiresAt: Date.now() + 1000 * 60 * 60 * 24,
      };
      localStorage.setItem("powerframe_user", JSON.stringify(devSession));
    }
  } catch {
    // Invalid JSON: recreate dev session
    const devSession = {
      id: "dev-user",
      email: "dev@powerframe.local",
      name: "Powerframe Dev User",
      provider: "local-dev",
      token: "dev-token",
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    };
    localStorage.setItem("powerframe_user", JSON.stringify(devSession));
  }

  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProjectProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>

              {/* Root: redirect to app if authenticated, else to Hub login via PrivateRoute */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Navigate to="/bms" replace />
                  </PrivateRoute>
                }
              />

              {/* BMS Application */}
              <Route
                path="/bms"
                element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Overview />} />
                <Route path="projects" element={<Projects />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="plans" element={<Plans />} />
                <Route path="out" element={<Out />} />
                <Route path="search" element={<WebSearch />} />
                <Route path="files" element={<Files />} />
                <Route path="info" element={<Info />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="management" element={<Management />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </BrowserRouter>
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}