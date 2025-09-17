import React from 'react';
import { Search } from 'lucide-react';
import { SearchBarProps } from '../types';

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search blogs..."
        className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        onClick={onSearch}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600"
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
};