import { useMemo } from 'react';
import { Product, FilterOptions } from '../types/models';

/**
 * useProductFilter Hook
 * 
 * Custom hook for filtering products based on multiple criteria.
 * Implements category, price, size, color, and search query filtering.
 * 
 * Requirements: 1.5, 7.2, 7.4, 7.5
 * 
 * @param products - Array of all available products
 * @param filters - Current filter options
 * @returns Object containing filtered products and result count
 */
export const useProductFilter = (products: Product[], filters: FilterOptions) => {
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category (Requirement 1.5)
    if (filters.category && filters.category !== 'all') {
      result = result.filter(product => product.category === filters.category);
    }

    // Filter by price range (Requirement 7.4)
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      result = result.filter(product => product.price >= min && product.price <= max);
    }

    // Filter by sizes (Requirement 7.4)
    // Product must have at least one of the selected sizes
    if (filters.sizes && filters.sizes.length > 0) {
      result = result.filter(product =>
        filters.sizes!.some(size => product.sizes.includes(size))
      );
    }

    // Filter by colors (Requirement 7.4)
    // Product must have at least one of the selected colors
    if (filters.colors && filters.colors.length > 0) {
      result = result.filter(product =>
        filters.colors!.some(color =>
          product.colors.some(productColor =>
            productColor.toLowerCase().includes(color.toLowerCase())
          )
        )
      );
    }

    // Filter by search query (Requirement 7.2)
    // Search in product name and description (case-insensitive)
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, filters]);

  // Return filtered products and count (Requirement 7.5)
  return {
    filteredProducts,
    resultCount: filteredProducts.length,
  };
};
