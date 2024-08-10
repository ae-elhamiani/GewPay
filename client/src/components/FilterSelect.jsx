import React from 'react';
import { ChevronDown } from 'lucide-react';

const FilterSelect = ({ options, value, onChange, label }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="appearance-none bg-white text-gray-700 border border-gray-300 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
    >
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
  </div>
);

export default FilterSelect;