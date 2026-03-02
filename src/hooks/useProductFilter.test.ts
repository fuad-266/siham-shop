import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useProductFilter } from './useProductFilter';
import { Product, FilterOptions } from '../types/models';

/**
 * Unit tests for useProductFilter hook
 * 
 * Tests filtering logic for:
 * - Category filtering (Requirement 1.5)
 * - Price range filtering (Requirement 7.4)
 * - Size filtering (Requirement 7.4)
 * - Color filtering (Requirement 7.4)
 * - Search query filtering (Requirement 7.2)
 * - Multi-filter conjunction (Requirement 7.4)
 * - Result count accuracy (Requirement 7.5)
 */

// Mock product data for testing
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Black Casual Abaya',
    description: 'A comfortable everyday abaya',
    price: 1000,
    currency: 'ETB',
    images: ['image1.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Black'],
    category: 'casual',
    material: 'Cotton',
    careInstructions: 'Machine wash',
    inStock: true,
    featured: false,
  },
  {
    id: '2',
    name: 'Navy Formal Abaya',
    description: 'Elegant formal wear for special occasions',
    price: 2500,
    currency: 'ETB',
    images: ['image2.jpg'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Navy', 'Dark Blue'],
    category: 'formal',
    material: 'Silk',
    careInstructions: 'Dry clean',
    inStock: true,
    featured: true,
  },
  {
    id: '3',
    name: 'Burgundy Embroidered Abaya',
    description: 'Beautiful embroidered design with gold details',
    price: 1800,
    currency: 'ETB',
    images: ['image3.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Burgundy', 'Wine Red'],
    category: 'embroidered',
    material: 'Velvet',
    careInstructions: 'Dry clean',
    inStock: true,
    featured: false,
  },
  {
    id: '4',
    name: 'White Plain Abaya',
    description: 'Simple and elegant white abaya',
    price: 900,
    currency: 'ETB',
    images: ['image4.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['White', 'Off-White'],
    category: 'plain',
    material: 'Cotton',
    careInstructions: 'Machine wash',
    inStock: true,
    featured: false,
  },
  {
    id: '5',
    name: 'Grey Casual Abaya',
    description: 'Versatile grey abaya for daily wear',
    price: 1200,
    currency: 'ETB',
    images: ['image5.jpg'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Grey', 'Charcoal'],
    category: 'casual',
    material: 'Polyester',
    careInstructions: 'Machine wash',
    inStock: true,
    featured: false,
  },
];

describe('useProductFilter', () => {
  describe('Category Filtering (Requirement 1.5)', () => {
    it('should filter products by category', () => {
      const filters: FilterOptions = { category: 'casual' };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(2);
      expect(result.current.filteredProducts.every(p => p.category === 'casual')).toBe(true);
    });

    it('should return all products when category is "all"', () => {
      const filters: FilterOptions = { category: 'all' };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(5);
    });

    it('should return all products when no category filter is set', () => {
      const filters: FilterOptions = {};
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(5);
    });

    it('should return empty array for non-existent category', () => {
      const filters: FilterOptions = { category: 'nonexistent' };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(0);
    });
  });

  describe('Price Range Filtering (Requirement 7.4)', () => {
    it('should filter products within price range', () => {
      const filters: FilterOptions = { priceRange: { min: 1000, max: 1500 } };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(2);
      expect(result.current.filteredProducts.every(p => p.price >= 1000 && p.price <= 1500)).toBe(true);
    });

    it('should include products at exact min and max boundaries', () => {
      const filters: FilterOptions = { priceRange: { min: 900, max: 1200 } };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(3);
      expect(result.current.filteredProducts.some(p => p.price === 900)).toBe(true);
      expect(result.current.filteredProducts.some(p => p.price === 1200)).toBe(true);
    });

    it('should return empty array when no products match price range', () => {
      const filters: FilterOptions = { priceRange: { min: 5000, max: 6000 } };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(0);
    });
  });

  describe('Size Filtering (Requirement 7.4)', () => {
    it('should filter products that have at least one selected size', () => {
      const filters: FilterOptions = { sizes: ['XL'] };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(3);
      expect(result.current.filteredProducts.every(p => p.sizes.includes('XL'))).toBe(true);
    });

    it('should filter products matching any of multiple selected sizes', () => {
      const filters: FilterOptions = { sizes: ['S', 'XXL'] };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(4);
      expect(result.current.filteredProducts.every(p => 
        p.sizes.includes('S') || p.sizes.includes('XXL')
      )).toBe(true);
    });

    it('should return all products when sizes array is empty', () => {
      const filters: FilterOptions = { sizes: [] };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(5);
    });
  });

  describe('Color Filtering (Requirement 7.4)', () => {
    it('should filter products that have at least one selected color', () => {
      const filters: FilterOptions = { colors: ['Black'] };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].colors).toContain('Black');
    });

    it('should filter products matching any of multiple selected colors', () => {
      const filters: FilterOptions = { colors: ['Navy', 'Grey'] };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(2);
    });

    it('should perform case-insensitive color matching', () => {
      const filters: FilterOptions = { colors: ['navy'] };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].id).toBe('2');
    });

    it('should return all products when colors array is empty', () => {
      const filters: FilterOptions = { colors: [] };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(5);
    });
  });

  describe('Search Query Filtering (Requirement 7.2)', () => {
    it('should filter products by name match', () => {
      const filters: FilterOptions = { searchQuery: 'Casual' };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(2);
      expect(result.current.filteredProducts.every(p => 
        p.name.toLowerCase().includes('casual')
      )).toBe(true);
    });

    it('should filter products by description match', () => {
      const filters: FilterOptions = { searchQuery: 'elegant' };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(2);
    });

    it('should perform case-insensitive search', () => {
      const filters: FilterOptions = { searchQuery: 'FORMAL' };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].id).toBe('2');
    });

    it('should trim whitespace from search query', () => {
      const filters: FilterOptions = { searchQuery: '  embroidered  ' };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].id).toBe('3');
    });

    it('should return all products when search query is empty', () => {
      const filters: FilterOptions = { searchQuery: '' };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(5);
    });

    it('should return all products when search query is only whitespace', () => {
      const filters: FilterOptions = { searchQuery: '   ' };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(5);
    });
  });

  describe('Multi-Filter Conjunction (Requirement 7.4)', () => {
    it('should apply all filters simultaneously', () => {
      const filters: FilterOptions = {
        category: 'casual',
        priceRange: { min: 1000, max: 1500 },
        sizes: ['M'],
      };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(2);
      expect(result.current.filteredProducts.every(p => 
        p.category === 'casual' &&
        p.price >= 1000 && p.price <= 1500 &&
        p.sizes.includes('M')
      )).toBe(true);
    });

    it('should combine category, price, size, color, and search filters', () => {
      const filters: FilterOptions = {
        category: 'casual',
        priceRange: { min: 900, max: 1300 },
        sizes: ['L'],
        colors: ['Black'],
        searchQuery: 'everyday',
      };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].id).toBe('1');
    });

    it('should return empty array when no products match all criteria', () => {
      const filters: FilterOptions = {
        category: 'formal',
        priceRange: { min: 100, max: 500 },
      };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(0);
    });
  });

  describe('Result Count Accuracy (Requirement 7.5)', () => {
    it('should return accurate count of filtered products', () => {
      const filters: FilterOptions = { category: 'casual' };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.resultCount).toBe(2);
      expect(result.current.resultCount).toBe(result.current.filteredProducts.length);
    });

    it('should return zero count when no products match', () => {
      const filters: FilterOptions = { searchQuery: 'nonexistent' };
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.resultCount).toBe(0);
      expect(result.current.resultCount).toBe(result.current.filteredProducts.length);
    });

    it('should return total count when no filters applied', () => {
      const filters: FilterOptions = {};
      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.resultCount).toBe(5);
      expect(result.current.resultCount).toBe(mockProducts.length);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty product array', () => {
      const filters: FilterOptions = { category: 'casual' };
      const { result } = renderHook(() => useProductFilter([], filters));

      expect(result.current.filteredProducts).toHaveLength(0);
      expect(result.current.resultCount).toBe(0);
    });

    it('should handle products with empty color arrays', () => {
      const productsWithEmptyColors: Product[] = [
        { ...mockProducts[0], colors: [] },
      ];
      const filters: FilterOptions = { colors: ['Black'] };
      const { result } = renderHook(() => useProductFilter(productsWithEmptyColors, filters));

      expect(result.current.filteredProducts).toHaveLength(0);
    });

    it('should handle products with empty size arrays', () => {
      const productsWithEmptySizes: Product[] = [
        { ...mockProducts[0], sizes: [] },
      ];
      const filters: FilterOptions = { sizes: ['M'] };
      const { result } = renderHook(() => useProductFilter(productsWithEmptySizes, filters));

      expect(result.current.filteredProducts).toHaveLength(0);
    });
  });
});
