import React, { useState } from 'react';
import {useLocation, useNavigate } from 'react-router-dom';
import { Home, Store, RefreshCcw, Zap, Rocket, Settings, ChevronRight, ChevronLeft, Shield, X } from 'lucide-react';
import Logo from '../../components/common/Logo';
import LogoDark from '../../components/common/Logo-d';
import LogoSmall from '../../components/common/Logo-s';

const sidebarItems = [
  { icon: Home, text: "Personal space", path: "/dashboard" },
  { icon: Store, text: "Stores space", path: "/dashboard/stores" },
  { icon: RefreshCcw, text: "P2P trade wallet", path: "/dashboard/p2p", requiresKYC: true },
  { icon: Zap, text: "Quick Actions", path: "/dashboard/actions", requiresKYC: true },
  { icon: Settings, text: "Settings", path: "/dashboard/settings" }
];

const Sidebar = ({ isDarkMode, isSidebarOpen, toggleSidebar, handleUpgrade }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showKYCModal, setShowKYCModal] = useState(false);

  const handleItemClick = (item) => {
    if (item.requiresKYC) {
      const isKYCCompleted = false; // Replace with actual KYC check
      if (!isKYCCompleted) {
        setShowKYCModal(true);
        return;
      }
    }
    navigate(item.path);
  };

  const isItemActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`fixed inset-y-1 left-0 z-40 ${isSidebarOpen ? 'w-76' : 'w-22'} transition-all duration-300 ease-in-out`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} h-3333 m-3 rounded-2xl shadow-lg flex flex-col `}>
        <button
          onClick={toggleSidebar}
          className="absolute top-11 -right-1 bg-purple-400 text-white p-1 rounded-full shadow-lg transition-transform duration-300"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-center h-16 mb-6">
              {isSidebarOpen ? 
                (isDarkMode ? <LogoDark /> : <Logo />) : 
                <LogoSmall />
              }
            </div>
            <nav className="space-y-1">
              {sidebarItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    isItemActive(item.path)
                      ? isDarkMode
                         ? 'bg-purple-800 text-white'
                         : 'bg-purple-100 text-purple-600'
                      : isDarkMode
                         ? 'text-gray-400 hover:bg-gray-700'
                         : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={isSidebarOpen ? "mr-3" : "mx-auto"} size={22} />
                  {isSidebarOpen && <span className="font-medium text-sm">{item.text}</span>}
                  {isSidebarOpen && item.text === "Stores space" && isItemActive(item.path) && (
                    <span className="ml-auto text-xs px-2 py-1 rounded-full bg-purple-200 text-purple-700">New</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="p-4">
          <button
            onClick={handleUpgrade}
            className="w-full relative overflow-hidden rounded-xl group shadow-lg"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-75 group-hover:opacity-100 transition-opacity duration-500 blur"></div>
            <span className="relative w-full py-3 flex items-center justify-center bg-purple-600 bg-opacity-75 hover:bg-opacity-90 text-white py-2 px-4 rounded-xl font-medium transition-all duration-200 transform group-hover:scale-105">
              <Rocket className={isSidebarOpen ? "mr-2" : ""} size={18} />
              {isSidebarOpen && <span className="text-sm">Upgrade to Premium</span>}
            </span>
            <div className="absolute inset-0 w-1/4 h-full bg-white opacity-20 transform -skew-x-12 animate-reflect"></div>
          </button>
        </div>
      </div>
      {showKYCModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} p-12 rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden`}>
            {/* Background gradient */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-500 opacity-10"></div> */}
            
            {/* Content */}
            <div className="relative z-10">
              <button
                onClick={() => setShowKYCModal(false)}
                className={`absolute -top-4 -right-4 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center mb-6">
                <Shield size={32} className="text-purple-500 mr-4" />
                <h2 className="text-2xl font-bold">KYC Validation Required</h2>
              </div>
              
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                To access this feature, you need to complete the Know Your Customer (KYC) verification process. This helps us maintain a secure and compliant platform for all users.
              </p>
              
              <div className="flex justify-center space-x-0">
                <button
                  onClick={() => {
                    setShowKYCModal(false);
                    navigate('/settings/kyc');
                  }}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 "
                >
                  Start KYC Process
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;