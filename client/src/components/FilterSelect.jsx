import React from 'react';
import { ChevronDown } from 'lucide-react';

const FilterSelect = ({ options, value, onChange, label, isDarkMode }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className={`appearance-none py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 ${
        isDarkMode
          ? 'bg-purple-900 text-white border-purple-700 focus:ring-purple-500'
          : 'bg-white text-purple-600 border-purple-300 focus:ring-purple-400'
      } border shadow-sm transition-colors duration-200`}
    >
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    <ChevronDown 
      className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
        isDarkMode ? 'text-purple-300' : 'text-purple-500'
      }`} 
      size={20} 
    />
  </div>
);

export default FilterSelect;