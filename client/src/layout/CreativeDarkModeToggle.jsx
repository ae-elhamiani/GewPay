import React from 'react';
import { Sun, Moon } from 'lucide-react';

const CreativeDarkModeToggle = ({ isDarkMode, toggleDarkMode }) => (
  <button
    onClick={toggleDarkMode}
    className={`relative w-20 h-10 bg-white bg-opacity-20 rounded-full p-1 transition-colors duration-500 ease-in-out focus:outline-none ${
      isDarkMode ? 'bg-gray-800' : 'bg-purple-300'
    }`}
  >
    <div
      className={`absolute w-8 h-8 rounded-full shadow-md top-1 transform duration-500 ease-in-out ${
        isDarkMode ? 'translate-x-10 bg-gray-700' : 'translate-x-0 bg-white'
      }`}
    >
      {isDarkMode ? (
        <Moon className="h-6 w-6 text-purple-300 absolute top-1 left-1" />
      ) : (
        <Sun className="h-6 w-6 text-yellow-500 absolute top-1 left-1" />
      )}
    </div>
  </button>
);

export default CreativeDarkModeToggle;