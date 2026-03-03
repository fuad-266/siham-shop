import { useState, useEffect } from 'react';
import { FilterOptions } from '../types/models';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  availableCategories?: string[];
  availableSizes?: string[];
  availableColors?: string[];
  minPrice?: number;
  maxPrice?: number;
}

/**
 * FilterPanel Component
 * 
 * Advanced filtering options for product catalog.
 * Features:
 * - Category selection
 * - Price range slider
 * - Size checkboxes
 * - Color checkboxes
 * - Active filter badges with clear options
 * 
 * Requirements: 7.3, 7.4
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  availableCategories = ['casual', 'formal', 'embroidered', 'plain'],
  availableSizes = ['S', 'M', 'L', 'XL', 'XXL'],
  availableColors = ['Black', 'Navy', 'Burgundy', 'Grey', 'White', 'Blue', 'Green', 'Purple', 'Brown', 'Beige'],
  minPrice = 0,
  maxPrice = 4000,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  // Sync local filters with prop changes
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Calculate active filter count
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (localFilters.category) count++;
    if (localFilters.priceRange) count++;
    if (localFilters.sizes && localFilters.sizes.length > 0) count += localFilters.sizes.length;
    if (localFilters.colors && localFilters.colors.length > 0) count += localFilters.colors.length;
    return count;
  };

  const handleCategoryChange = (category: string) => {
    const newFilters = {
      ...localFilters,
      category: category === localFilters.category ? undefined : category,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    const newFilters = {
      ...localFilters,
      priceRange: { min, max },
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSizeToggle = (size: string) => {
    const currentSizes = localFilters.sizes || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    
    const newFilters = {
      ...localFilters,
      sizes: newSizes.length > 0 ? newSizes : undefined,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleColorToggle = (color: string) => {
    const currentColors = localFilters.colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color];
    
    const newFilters = {
      ...localFilters,
      colors: newColors.length > 0 ? newColors : undefined,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      searchQuery: localFilters.searchQuery, // Keep search query
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="filter-panel" role="region" aria-label="Product filters">
      {/* Filter Header */}
      <div className="filter-panel__header">
        <h2 className="filter-panel__title">Filters</h2>
        {activeFilterCount > 0 && (
          <div className="filter-panel__badge-container">
            <span className="filter-panel__badge" aria-label={`${activeFilterCount} active filters`}>
              {activeFilterCount}
            </span>
            <button
              className="filter-panel__clear-btn"
              onClick={handleClearFilters}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClearFilters();
                }
              }}
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="filter-panel__section">
        <h3 className="filter-panel__section-title">Category</h3>
        <div className="filter-panel__category-list" role="group" aria-label="Category filters">
          {availableCategories.map((category) => (
            <button
              key={category}
              className={`filter-panel__category-btn ${
                localFilters.category === category ? 'filter-panel__category-btn--active' : ''
              }`}
              onClick={() => handleCategoryChange(category)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryChange(category);
                }
              }}
              aria-pressed={localFilters.category === category}
              aria-label={`Filter by ${category} category`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="filter-panel__section">
        <h3 className="filter-panel__section-title">Price Range</h3>
        <div className="filter-panel__price-range">
          <div className="filter-panel__price-inputs">
            <div className="filter-panel__price-input-group">
              <label htmlFor="price-min" className="filter-panel__price-label">
                Min
              </label>
              <input
                id="price-min"
                type="number"
                className="filter-panel__price-input"
                value={localFilters.priceRange?.min ?? minPrice}
                onChange={(e) => {
                  const min = Number(e.target.value);
                  const max = localFilters.priceRange?.max ?? maxPrice;
                  handlePriceRangeChange(min, max);
                }}
                min={minPrice}
                max={maxPrice}
                aria-label="Minimum price"
              />
            </div>
            <span className="filter-panel__price-separator">-</span>
            <div className="filter-panel__price-input-group">
              <label htmlFor="price-max" className="filter-panel__price-label">
                Max
              </label>
              <input
                id="price-max"
                type="number"
                className="filter-panel__price-input"
                value={localFilters.priceRange?.max ?? maxPrice}
                onChange={(e) => {
                  const min = localFilters.priceRange?.min ?? minPrice;
                  const max = Number(e.target.value);
                  handlePriceRangeChange(min, max);
                }}
                min={minPrice}
                max={maxPrice}
                aria-label="Maximum price"
              />
            </div>
          </div>
          <input
            type="range"
            className="filter-panel__price-slider"
            min={minPrice}
            max={maxPrice}
            value={localFilters.priceRange?.max ?? maxPrice}
            onChange={(e) => {
              const min = localFilters.priceRange?.min ?? minPrice;
              const max = Number(e.target.value);
              handlePriceRangeChange(min, max);
            }}
            aria-label="Price range slider"
          />
          <div className="filter-panel__price-display">
            {localFilters.priceRange?.min ?? minPrice} ETB - {localFilters.priceRange?.max ?? maxPrice} ETB
          </div>
        </div>
      </div>

      {/* Size Filter */}
      <div className="filter-panel__section">
        <h3 className="filter-panel__section-title">Size</h3>
        <div className="filter-panel__checkbox-group" role="group" aria-label="Size filters">
          {availableSizes.map((size) => (
            <label key={size} className="filter-panel__checkbox-label">
              <input
                type="checkbox"
                className="filter-panel__checkbox"
                checked={localFilters.sizes?.includes(size) || false}
                onChange={() => handleSizeToggle(size)}
                aria-label={`Filter by size ${size}`}
              />
              <span className="filter-panel__checkbox-text">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="filter-panel__section">
        <h3 className="filter-panel__section-title">Color</h3>
        <div className="filter-panel__checkbox-group" role="group" aria-label="Color filters">
          {availableColors.map((color) => (
            <label key={color} className="filter-panel__checkbox-label">
              <input
                type="checkbox"
                className="filter-panel__checkbox"
                checked={localFilters.colors?.includes(color) || false}
                onChange={() => handleColorToggle(color)}
                aria-label={`Filter by color ${color}`}
              />
              <span className="filter-panel__checkbox-text">{color}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
