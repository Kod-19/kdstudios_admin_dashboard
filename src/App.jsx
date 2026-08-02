import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from '../src/routes/ProtectedRoute';
import DashboardLayout from '../src/components/DashboardLayout';
import LoginPage from '../src/pages/auth/LoginPage';
import Overview from './pages/Overview';
import Inbox from './pages/Inbox';
import Settings from './pages/Settings';
import Projects from './pages/Projects';
import MediaLibrary from './pages/MediaLibrary';
import Blog from './pages/Blog';
import Payments from './pages/Payments';

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
              <Route path="blog" element={<Blog />} />
              <Route index element={<Overview />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="settings" element={<Settings />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="projects" element={<Projects />} />
              <Route path="blog" element={<div className="text-white">Blog Module Placeholder</div>} />
              <Route path="payments" element={<div className="text-white">Payments Module Placeholder</div>} />
              <Route path="clients" element={<div className="text-white">Clients Module Placeholder</div>} />
              <Route path="media" element={<div className="text-white">Media Library Placeholder</div>} />
              <Route path="settings" element={<div className="text-white">Settings Module Placeholder</div>} />
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