import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder, isDarkMode }) => (
  <div className={`relative hidden md:block ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'} rounded-lg`}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full py-2 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 ${
        isDarkMode 
          ? 'bg-purple-900 text-white placeholder-white focus:ring-purple-500' 
          : 'bg-purple-100 text-purple-900 placeholder-purple-600 focus:ring-purple-400'
      } transition-colors duration-200`}
    />
    <Search 
      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
        isDarkMode ? 'text-white' : 'text-purple-600'
      }`} 
      size={20} 
    />
  </div>
);

export default SearchInput;