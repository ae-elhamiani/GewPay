import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAddress, useDisconnect } from '@thirdweb-dev/react';

import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import useDarkMode from '../../hooks/useDarkMode';

const DashboardLayout = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userType, setUserType] = useState('basic');
  const [notifications, setNotifications] = useState([]);
  const disconnect = useDisconnect();
  const navigate = useNavigate();

  // Mock user data - replace with actual user data from your auth system
  const userData = {
    name: "ae.elhamiani",
    // balance: 2234.00
  };

  useEffect(() => {
    // Simulating fetching notifications from backend
    const fetchNotifications = async () => {
      // Replace this with actual API call
      const mockNotifications = [
        { id: 1, message: "Your account has been verified", time: "Just now", read: true },
        { id: 2, message: "New feature: Dark mode is now available!", time: "1 day ago", read: false },
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();

    // Simulating real-time notifications
    const notificationInterval = setInterval(() => {
      setNotifications(prev => [
        { id: Date.now(), message: "New notification", time: "Just now", read: false },
        ...prev
      ]);
    }, 30000); // Add a new notification every 30 seconds

    return () => clearInterval(notificationInterval);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleUpgrade = () => {
    console.log('Upgrading to premium...');
    setUserType('premium');
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
    disconnect();
    localStorage.removeItem('authToken');
    localStorage.removeItem('merchantId');
    localStorage.removeItem('registrationStep');
    // setIsMerchant(false);
    navigate('/wallet');    navigate('/'); // Redirect to login page
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-purple-50 via-white to-pink-50'}`}>
      <Sidebar 
        isDarkMode={isDarkMode} 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        userType={userType}
        handleUpgrade={handleUpgrade}
      />
      <div className="flex-1 flex flex-col ml-[17rem]">
        <Header 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
          userName={userData.name}
          balance={userData.balance}
          notifications={notifications}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet context={{ isDarkMode, toggleDarkMode }} />
        </main>
        <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default DashboardLayout;