import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Layout from './layout/AuthLayout';
import DashboardLayout from './layout/DashboardLayout';
import Wallet from './pages/Wallet';
import Phone from './pages/Phone';
import PhoneOTP from './pages/PhoneOTP';
import Email from './pages/Email';
import EmailOTP from './pages/EmailOTP';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import { ProfileProvider } from './hooks/ProfileProvider';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ProfileProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/wallet" replace />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="register-email" element={<Email />} />
          <Route path="verify-email-otp" element={<EmailOTP />} />
          <Route path="register-phone" element={<Phone />} />
          <Route path="verify-phone-otp" element={<PhoneOTP />} />
        </Route>

        {/* Protected routes */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          {/* Add other dashboard-related routes here */}
        </Route>

        {/* 404 Not Found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ProfileProvider>
  );
}

export default App;