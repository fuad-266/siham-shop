import { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

/**
 * SearchBar Component
 * 
 * Implements debounced search input with clear button and accessibility support.
 * 
 * Requirements: 7.1, 7.2
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search for abayas...',
  initialValue = '',
}) => {
  const [query, setQuery] = useState(initialValue);
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set up debounced search
    debounceTimerRef.current = window.setTimeout(() => {
      onSearch(query);
    }, 400); // 400ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="search-bar" role="search">
      <div className="search-bar__inner">
        <div className="search-bar__icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          className="search-bar__input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products"
        />
        {query && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={handleClear}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClear();
              }
            }}
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
