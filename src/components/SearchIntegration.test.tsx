import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from './SearchBar';
import { ProductCatalog } from './ProductCatalog';
import { useProductFilter } from '../hooks/useProductFilter';
import { Product, FilterOptions } from '../types/models';

// Mock products for testing
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Black Abaya',
    description: 'Elegant black abaya for formal occasions',
    price: 1500,
    currency: 'ETB',
    images: ['image1.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Black'],
    category: 'formal',
    material: 'Polyester',
    careInstructions: 'Hand wash',
    inStock: true,
    featured: false,
  },
  {
    id: '2',
    name: 'Navy Blue Casual Abaya',
    description: 'Comfortable navy blue abaya for everyday wear',
    price: 1200,
    currency: 'ETB',
    images: ['image2.jpg'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Navy'],
    category: 'casual',
    material: 'Cotton',
    careInstructions: 'Machine wash',
    inStock: true,
    featured: true,
  },
  {
    id: '3',
    name: 'Embroidered Burgundy Abaya',
    description: 'Beautiful embroidered burgundy abaya with intricate details',
    price: 2500,
    currency: 'ETB',
    images: ['image3.jpg'],
    sizes: ['S', 'M'],
    colors: ['Burgundy'],
    category: 'embroidered',
    material: 'Silk blend',
    careInstructions: 'Dry clean only',
    inStock: true,
    featured: true,
  },
];

/**
 * Integration tests for SearchBar with product filtering
 * 
 * Tests the integration between SearchBar component and the filtering logic
 * to ensure search queries properly filter products and display appropriate messages.
 * 
 * Requirements: 7.2, 7.6
 */
describe('SearchBar Integration with Product Filtering', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Search Query Filtering', () => {
    it('should filter products by name when search query is entered', () => {
      let currentFilters: FilterOptions = {};
      const handleSearch = (query: string) => {
        currentFilters = { ...currentFilters, searchQuery: query };
      };

      const { rerender } = render(<SearchBar onSearch={handleSearch} />);

      const input = screen.getByRole('textbox', { name: /search products/i });
      fireEvent.change(input, { target: { value: 'Black' } });
      vi.advanceTimersByTime(300);

      // Verify filter was updated
      expect(currentFilters.searchQuery).toBe('Black');

      // Apply filter and render results
      const { filteredProducts } = useProductFilter(mockProducts, currentFilters);
      
      const mockOnProductClick = vi.fn();
      rerender(
        <>
          <SearchBar onSearch={handleSearch} />
          <ProductCatalog products={filteredProducts} onProductClick={mockOnProductClick} />
        </>
      );

      // Should show only the Black Abaya
      expect(filteredProducts).toHaveLength(1);
      expect(filteredProducts[0].name).toBe('Black Abaya');
    });

    it('should filter products by description when search query is entered', () => {
      const filters: FilterOptions = { searchQuery: 'embroidered' };
      const { filteredProducts } = useProductFilter(mockProducts, filters);

      expect(filteredProducts).toHaveLength(1);
      expect(filteredProducts[0].name).toBe('Embroidered Burgundy Abaya');
    });

    it('should be case-insensitive when filtering', () => {
      const filters: FilterOptions = { searchQuery: 'NAVY' };
      const { filteredProducts } = useProductFilter(mockProducts, filters);

      expect(filteredProducts).toHaveLength(1);
      expect(filteredProducts[0].name).toBe('Navy Blue Casual Abaya');
    });

    it('should return all products when search query is empty', () => {
      const filters: FilterOptions = { searchQuery: '' };
      const { filteredProducts } = useProductFilter(mockProducts, filters);

      expect(filteredProducts).toHaveLength(3);
    });

    it('should return no products when search query matches nothing', () => {
      const filters: FilterOptions = { searchQuery: 'nonexistent' };
      const { filteredProducts } = useProductFilter(mockProducts, filters);

      expect(filteredProducts).toHaveLength(0);
    });
  });

  describe('No Results Message', () => {
    it('should display "no results" message when search returns no products', () => {
      const filters: FilterOptions = { searchQuery: 'xyz123' };
      const { filteredProducts } = useProductFilter(mockProducts, filters);
      const mockOnProductClick = vi.fn();

      render(<ProductCatalog products={filteredProducts} onProductClick={mockOnProductClick} />);

      // Should show empty state message
      const emptyMessage = screen.getByRole('status');
      expect(emptyMessage).toHaveTextContent(/no products found matching your criteria/i);
    });

    it('should not display "no results" message when products are found', () => {
      const filters: FilterOptions = { searchQuery: 'Black' };
      const { filteredProducts } = useProductFilter(mockProducts, filters);
      const mockOnProductClick = vi.fn();

      render(<ProductCatalog products={filteredProducts} onProductClick={mockOnProductClick} />);

      // Should not show empty state message
      const emptyMessage = screen.queryByText(/no products found matching your criteria/i);
      expect(emptyMessage).not.toBeInTheDocument();
    });

    it('should display product count when products are found', () => {
      const filters: FilterOptions = { searchQuery: 'abaya' };
      const { filteredProducts } = useProductFilter(mockProducts, filters);
      const mockOnProductClick = vi.fn();

      render(<ProductCatalog products={filteredProducts} onProductClick={mockOnProductClick} />);

      // Should show product count
      const countElement = screen.getByText(/3 products found/i);
      expect(countElement).toBeInTheDocument();
    });

    it('should update count when search query changes', () => {
      let currentFilters: FilterOptions = {};
      const handleSearch = (query: string) => {
        currentFilters = { ...currentFilters, searchQuery: query };
      };

      const mockOnProductClick = vi.fn();
      const { rerender } = render(
        <>
          <SearchBar onSearch={handleSearch} />
          <ProductCatalog products={mockProducts} onProductClick={mockOnProductClick} />
        </>
      );

      // Initial state - all products
      expect(screen.getByText(/3 products found/i)).toBeInTheDocument();

      // Search for "Black"
      const input = screen.getByRole('textbox', { name: /search products/i });
      fireEvent.change(input, { target: { value: 'Black' } });
      vi.advanceTimersByTime(300);

      const { filteredProducts } = useProductFilter(mockProducts, currentFilters);
      rerender(
        <>
          <SearchBar onSearch={handleSearch} />
          <ProductCatalog products={filteredProducts} onProductClick={mockOnProductClick} />
        </>
      );

      // Should show updated count
      expect(screen.getByText(/1 product found/i)).toBeInTheDocument();
    });
  });

  describe('Search with Other Filters', () => {
    it('should combine search query with category filter', () => {
      const filters: FilterOptions = {
        searchQuery: 'abaya',
        category: 'casual',
      };
      const { filteredProducts } = useProductFilter(mockProducts, filters);

      expect(filteredProducts).toHaveLength(1);
      expect(filteredProducts[0].name).toBe('Navy Blue Casual Abaya');
    });

    it('should combine search query with price range filter', () => {
      const filters: FilterOptions = {
        searchQuery: 'abaya',
        priceRange: { min: 1000, max: 1500 },
      };
      const { filteredProducts } = useProductFilter(mockProducts, filters);

      expect(filteredProducts).toHaveLength(2);
      expect(filteredProducts.map(p => p.name)).toContain('Black Abaya');
      expect(filteredProducts.map(p => p.name)).toContain('Navy Blue Casual Abaya');
    });

    it('should return no products when search and filters have no matches', () => {
      const filters: FilterOptions = {
        searchQuery: 'Black',
        category: 'casual', // Black abaya is formal, not casual
      };
      const { filteredProducts } = useProductFilter(mockProducts, filters);

      expect(filteredProducts).toHaveLength(0);
    });
  });

  describe('Clear Search', () => {
    it('should show all products when search is cleared', () => {
      let currentFilters: FilterOptions = { searchQuery: 'Black' };
      const handleSearch = (query: string) => {
        currentFilters = { ...currentFilters, searchQuery: query };
      };

      const mockOnProductClick = vi.fn();
      const { rerender } = render(
        <>
          <SearchBar onSearch={handleSearch} />
          <ProductCatalog products={mockProducts} onProductClick={mockOnProductClick} />
        </>
      );

      // Initially filtered
      let { filteredProducts } = useProductFilter(mockProducts, currentFilters);
      expect(filteredProducts).toHaveLength(1);

      // Clear search
      const input = screen.getByRole('textbox', { name: /search products/i });
      fireEvent.change(input, { target: { value: 'Black' } });
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      fireEvent.click(clearButton);

      // Update filters
      ({ filteredProducts } = useProductFilter(mockProducts, currentFilters));
      rerender(
        <>
          <SearchBar onSearch={handleSearch} />
          <ProductCatalog products={filteredProducts} onProductClick={mockOnProductClick} />
        </>
      );

      // Should show all products
      expect(filteredProducts).toHaveLength(3);
    });
  });

  describe('Accessibility', () => {
    it('should announce result count changes to screen readers', () => {
      const filters: FilterOptions = { searchQuery: 'Black' };
      const { filteredProducts } = useProductFilter(mockProducts, filters);
      const mockOnProductClick = vi.fn();

      render(<ProductCatalog products={filteredProducts} onProductClick={mockOnProductClick} />);

      const countElement = screen.getByText(/1 product found/i);
      expect(countElement).toHaveAttribute('aria-live', 'polite');
    });

    it('should announce empty state to screen readers', () => {
      const filters: FilterOptions = { searchQuery: 'nonexistent' };
      const { filteredProducts } = useProductFilter(mockProducts, filters);
      const mockOnProductClick = vi.fn();

      render(<ProductCatalog products={filteredProducts} onProductClick={mockOnProductClick} />);

      const emptyMessage = screen.getByRole('status');
      expect(emptyMessage).toBeInTheDocument();
    });
  });
});
