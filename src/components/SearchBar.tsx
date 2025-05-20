import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import config from '../utils/config';

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useFilters();
  const [inputValue, setInputValue] = useState(searchQuery);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const handleSearch = useCallback(
    (value: string) => {
      // Clear any existing timeout
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set up a new timeout
      debounceTimerRef.current = setTimeout(() => {
        setSearchQuery(value);
      }, config.SEARCH_DEBOUNCE_DELAY);
    },
    [setSearchQuery]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    handleSearch(value);
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchQuery('');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 relative">
      <div className="relative">
        <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search movies by title or actor..."
          value={inputValue}
          onChange={handleInputChange}
          className="w-full pl-10 pr-10 py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-600 text-gray-800 dark:text-white shadow-sm"
        />
        {inputValue && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <XIcon size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;