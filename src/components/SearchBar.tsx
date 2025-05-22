import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SearchIcon, XIcon, Loader2Icon } from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import config from '../utils/config';
import { BaseProps, WithLoadingProps, WithErrorProps, withLoading, withError } from './common/BaseComponent';

/**
 * Props for the SearchBar component.
 * - Extends loading and error props for HOC composition.
 */
interface SearchBarProps extends WithLoadingProps, WithErrorProps {
  /** Initial value for the search input */
  initialValue?: string;
  /** Optional callback for search action */
  onSearch?: (value: string) => void;
}

/**
 * Loading state component for the search bar.
 */
const SearchLoadingComponent: React.FC<BaseProps> = ({ className }) => (
  <div className={className}>
    <Loader2Icon className="animate-spin mx-auto" size={24} />
  </div>
);

/**
 * Error state component for the search bar.
 */
const SearchErrorComponent: React.FC<BaseProps & { message?: string }> = ({ message, className }) => (
  <div className={`text-red-500 text-sm ${className}`}>
    {message || 'Error occurred while searching'}
  </div>
);

/**
 * Base search bar component (before HOC enhancement).
 * - Handles debounced search input and clear functionality.
 * - Decoupled from business logic, receives state via context.
 */
const BaseSearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  className = '',
}) => {
  // Access search state and updater from context
  const { searchQuery, setSearchQuery } = useFilters();
  // Local state for input value
  const [inputValue, setInputValue] = useState(initialValue || searchQuery);
  // Ref for debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  /**
   * Debounced search handler to avoid excessive updates.
   * Only updates the context after a delay.
   */
  const handleSearch = useCallback(
    (value: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        setSearchQuery(value);
      }, config.SEARCH_DEBOUNCE_DELAY);
    },
    [setSearchQuery]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * Clear the search input and reset filter.
   */
  const clearSearch = () => {
    setInputValue('');
    handleSearch('');
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div className="relative">
        {/* Search icon on the left */}
        <SearchIcon
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
        />
        {/* Search input field */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Search movies by title, actor, or director..."
          className="w-full pl-10 pr-10 py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-600 text-gray-800 dark:text-white shadow-sm"
          data-testid="search-input"
        />
        {/* Clear button appears only if input is not empty */}
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

/**
 * Enhanced SearchBar component with loading and error HOCs.
 */
const EnhancedSearchBar = withLoading(
  withError(BaseSearchBar, SearchErrorComponent),
  SearchLoadingComponent
);

export default EnhancedSearchBar;