import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import Layout from './components/layout/Layout';
import DashboardLayout from './components/layout/DashboardLayout';
import Wallet from './pages/Wallet';
import Phone from './pages/Phone';
import PhoneOTP from './pages/PhoneOTP';
import Email from './pages/Email';
import EmailOTP from './pages/EmailOTP';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';

import { ProfileProvider } from './hooks/ProfileProvider';

function App() {
  return (
    <ProfileProvider>
      <Routes>
        {/* Authentication routes */}
        <Route path="/" element={<Layout />}>
          <Route path="wallet" element={<Wallet />} />
          <Route path="profile" element={<Profile />} />
          <Route path="register-email" element={<Email />} />
          <Route path="verify-email-otp" element={<EmailOTP />} />
          <Route path="register-phone" element={<Phone />} />
          <Route path="verify-phone-otp" element={<PhoneOTP />} />
        </Route>

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          {/* Add other dashboard-related routes here */}
        </Route>
      </Routes>
    </ProfileProvider>
  );
}

export default App;