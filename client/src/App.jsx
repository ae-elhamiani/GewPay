import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import Layout from './components/layout/Layout';
import Wallet from './pages/Wallet';
import Phone from './pages/Phone';
import PhoneOTP from './pages/PhoneOTP';

import Email from './pages/Email';
import './index.css';

import { ProfileProvider } from './contexts/profileContext';
import Profile from './pages/Profile';
import EmailOTP from './pages/EmailOTP';

function App() {
  return (
    <ProfileProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="wallet" element={<Wallet />} />
          <Route path="profile" element={<Profile />} />
          <Route path="register-email" element={<Email />} />
          <Route path="verify-email-otp" element={<EmailOTP />} />
          <Route path="register-phone" element={<Phone />} />
          <Route path="verify-phone-otp" element={<PhoneOTP />} />
        </Route>
      </Routes>
    </ProfileProvider>
  );
}

export default App;
