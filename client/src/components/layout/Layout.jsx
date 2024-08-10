// src/components/layout/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Whale from '../common/Whale';
import CardData from '../Profile/CardData';
import { useProfileContext } from '../../hooks/ProfileProvider';
import Logo from '../common/Logo';

const Layout = () => {
  const location = useLocation();
  const { showCardData, setShowCardData } = useProfileContext();
  const [isCardVisible, setIsCardVisible] = useState(false);

  const routesWithCard = [
    '/profile',
    '/register-email',
    '/verify-email-otp',
    '/register-phone',
    '/verify-phone-otp',
  ];

  useEffect(() => {
    if (routesWithCard.includes(location.pathname)) {
      setShowCardData(true);
    } else {
      setShowCardData(false);
    }
  }, [location.pathname, setShowCardData]);

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <header className="w-full px-16 py-16 flex justify-start">
        <Logo />
      </header>
      <main className="flex-grow flex items-center justify-between px-16 z-10">
        <div className="w-1/2">
          <Outlet />
        </div>
        {showCardData && (
          <div className="w-1/2">
            <CardData isVisible={isCardVisible} />
          </div>
        )}
      </main>
      <Whale />
      <footer className="py-4 px-16 text-sm text-gray-500 z-10">
        Created by the Gwenod Team © 2024
      </footer>
    </div>
  );
};

export default Layout;