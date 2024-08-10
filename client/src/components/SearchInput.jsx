import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="relative flex-grow">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
    />
    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
  </div>
);

export default SearchInput;