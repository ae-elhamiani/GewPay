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
import StoresPage from './pages/StoresPage';
import StorePage from './pages/StorePage'; // New import for individual store page
import { ProfileProvider } from './hooks/ProfileProvider';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import Payment from './pages/Payment';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:5006/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ProfileProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/wallet" replace />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="profile" element={<Profile />} />
            <Route path="register-email" element={<Email />} />
            <Route path="verify-email-otp" element={<EmailOTP />} />
            <Route path="register-phone" element={<Phone />} />
            <Route path="verify-phone-otp" element={<PhoneOTP />} />
          </Route>

          <Route path="/payment-session/:sessionId" element={<Payment />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="stores" element={<StoresPage />} />
            <Route path=":storeId" element={<StorePage />} />{' '}
            {/* New route for individual store */}
          </Route>

          {/* 404 Not Found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ProfileProvider>
    </ApolloProvider>
  );
}

export default App;
