import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectProvider } from "./context/ProjectContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Login from "./pages/Login.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
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

export default function App() {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
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
        </Routes>
      </BrowserRouter>
      </ProjectProvider>
    </ThemeProvider>
  );
}
