import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Store, RefreshCcw, Zap, Rocket } from 'lucide-react';
import Logo from '../../components/common/Logo';
import LogoDark from '../../components/common/Logo-d';

const sidebarItems = [
  { icon: Home, text: "Personal space", path: "/dashboard" },
  { icon: Store, text: "Stores space", path: "/dashboard/stores" },
  { icon: RefreshCcw, text: "P2P trade wallet", path: "/dashboard/p2p" },
  { icon: Zap, text: "Quick Actions", path: "/dashboard/actions" }
];

const Sidebar = ({ isDarkMode, isSidebarOpen, handleUpgrade }) => {
  const location = useLocation();

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} h-full m-2 rounded-2xl shadow-lg flex flex-col`}>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between h-16 mb-6">
              {isDarkMode ? <LogoDark /> : <Logo />}
            </div>
            <nav className="space-y-1">
              {sidebarItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? isDarkMode 
                        ? 'bg-purple-800 text-white' 
                        : 'bg-purple-100 text-purple-600'
                      : isDarkMode 
                        ? 'text-gray-400 hover:bg-gray-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="mr-3" size={18} />
                  <span className="font-medium text-sm">{item.text}</span>
                  {item.text === "Stores space" && location.pathname === item.path && (
                    <span className="ml-auto text-xs px-2 py-1 rounded-full bg-purple-200 text-purple-700">New</span>
                  )}
                </NavLink>
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
            <span className="relative w-full flex items-center justify-center bg-purple-600 bg-opacity-75 hover:bg-opacity-90 text-white py-2 px-4 rounded-xl font-medium transition-all duration-200 transform group-hover:scale-105">
              <Rocket className="mr-2" size={16} />
              <span className="text-sm">Upgrade to Premium</span>
            </span>
            <div className="absolute inset-0 w-1/4 h-full bg-white opacity-20 transform -skew-x-12 animate-reflect"></div>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;