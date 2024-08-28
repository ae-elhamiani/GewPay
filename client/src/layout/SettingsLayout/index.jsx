import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../DashboardLayout/Sidebar';
import Header from '../DashboardLayout/Header';
import Footer from '../DashboardLayout/Footer';

const SettingsLayout = ({ isDarkMode, toggleDarkMode, onLogout, userName, balance }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your account has been verified", time: "Just now", read: false },
    { id: 2, message: "New feature: Dark mode is now available!", time: "1 day ago", read: true },
  ]);

  const handleUpgrade = () => {
    console.log('Upgrading to premium...');
    // Implement your upgrade logic here
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <Sidebar 
        isDarkMode={isDarkMode} 
        isSidebarOpen={isSidebarOpen} 
        handleUpgrade={handleUpgrade}
      />
      <div className="flex-1 flex flex-col ml-72">
        <Header 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={onLogout}
          userName={userName}
          balance={balance}
          notifications={notifications}
        />
        <main className="flex-grow p-6">
          <Outlet />
        </main>
        <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default SettingsLayout;