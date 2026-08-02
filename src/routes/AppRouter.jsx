import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/auth/DashboardPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<DashboardPage />} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRouter