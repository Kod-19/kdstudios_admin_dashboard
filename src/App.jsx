import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import LoginPage from "./pages/auth/LoginPage";
import Overview from "./pages/Overview";
import Inbox from "./pages/Inbox";
import Settings from "./pages/Settings";
import Projects from "./pages/Projects";
import MediaLibrary from "./pages/MediaLibrary";
import Blog from "./pages/Blog";
import Payments from "./pages/Payments";
import Clients from "./pages/Clients";
import ContentStudio from "./pages/ContentStudio";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="payments" element={<Payments />} />
              <Route path="clients" element={<Clients />} />
              <Route path="blog" element={<Blog />} />
              <Route index element={<Overview />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="messages" element={<Inbox />} />
              <Route path="settings" element={<Settings />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/new" element={<Projects initialMode="create" />} />
              <Route path="blog/new" element={<Blog initialMode="create" />} />
              <Route path="content" element={<ContentStudio />} />
            </Route>
          </Route>

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
