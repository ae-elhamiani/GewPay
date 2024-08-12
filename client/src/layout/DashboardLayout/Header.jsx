import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Search, ChevronDown, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import CreativeDarkModeToggle from '../CreativeDarkModeToggle';

const Header = ({ isDarkMode, toggleDarkMode, onLogout, userName, balance, notifications }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasNewNotifications = notifications.some(notif => !notif.read);

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <header className={`${isDarkMode ? 'bg-gradient-to-r from-purple-900 to-pink-900' : 'bg-gradient-to-r from-purple-500 to-purple-600'} text-white p-6 rounded-2xl shadow-lg`} style={{
      width: 'calc(96%)',
      margin: '20px 2%',
      background: isDarkMode 
        ? 'linear-gradient(89.92deg, rgba(76, 29, 149, 0.7) -1.43%, rgba(155, 16, 145, 0.315) 160.42%)'
        : 'linear-gradient(89.92deg, rgba(66, 34, 221, 0.7) -1.43%, rgba(243, 16, 145, 0.315) 160.42%)',
    }}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">Your Dashboard</h2>
          <p className="text-base opacity-80">Welcome back, {userName || 'User'}!</p>
          <div className="mt-4">
            <p className="text-sm opacity-80">Available balance</p>
            <p className="text-3xl font-bold mt-1">${balance?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4" ref={dropdownRef}>
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="py-2 px-4 pr-10 rounded-full bg-white bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white placeholder-white placeholder-opacity-75"
            />
            <Search className="absolute right-3 top-2.5 text-white opacity-75" size={20} />
          </div>
          <CreativeDarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <div className="relative">
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
            >
              <Bell size={20} />
              {hasNewNotifications && (
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-10">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="p-2 max-h-64 overflow-y-auto">
                  {notifications.map((notif, index) => (
                    <div key={index} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer">
                      <p className="text-sm text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-sm text-gray-500 p-2">No new notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
            >
              <User size={20} />
              <ChevronDown size={16} />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10">
                <Link to="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  <Settings size={16} className="inline-block mr-2" />
                  Settings
                </Link>
                <button 
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  <LogOut size={16} className="inline-block mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;