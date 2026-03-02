import { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

/**
 * SearchBar Component
 * 
 * Product search with live filtering.
 * Features:
 * - Debounced input for performance
 * - Clear button
 * - Search icon with animation
 * - Visible on all pages
 * 
 * Requirements: 7.1, 7.2
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search abayas...',
  debounceMs = 300,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search effect
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      onSearch(searchValue);
    }, debounceMs);

    // Cleanup on unmount or when searchValue changes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchValue, debounceMs, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger immediate search on form submit
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onSearch(searchValue);
  };

  return (
    <form 
      className="search-bar" 
      onSubmit={handleSubmit}
      role="search"
      aria-label="Product search"
    >
      <div className="search-bar__container">
        {/* Search Icon */}
        <svg
          className="search-bar__icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Search Input */}
        <input
          type="text"
          className="search-bar__input"
          value={searchValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-label="Search products"
          autoComplete="off"
        />

        {/* Clear Button */}
        {searchValue && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 4L4 12M4 4l8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};
