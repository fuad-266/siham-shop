import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCatalog } from './ProductCatalog';
import { Product } from '../types/models';

// Mock products for testing
const mockProducts: Product[] = [
  {
    id: 'test-1',
    name: 'Black Casual Abaya',
    description: 'A comfortable black abaya',
    price: 1200,
    currency: 'ETB',
    images: ['https://example.com/image1.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Black'],
    category: 'casual',
    material: 'Nida',
    careInstructions: 'Machine wash',
    inStock: true,
    featured: true,
  },
  {
    id: 'test-2',
    name: 'Navy Formal Abaya',
    description: 'An elegant navy abaya',
    price: 2500,
    currency: 'ETB',
    images: ['https://example.com/image2.jpg'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Navy'],
    category: 'formal',
    material: 'Chiffon',
    careInstructions: 'Dry clean',
    inStock: true,
    featured: false,
  },
  {
    id: 'test-3',
    name: 'Embroidered Abaya',
    description: 'Beautiful embroidered abaya',
    price: 2200,
    currency: 'ETB',
    images: ['https://example.com/image3.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    category: 'embroidered',
    material: 'Silk',
    careInstructions: 'Hand wash',
    inStock: true,
    featured: false,
  },
  {
    id: 'test-4',
    name: 'Plain Black Abaya',
    description: 'Simple plain abaya',
    price: 950,
    currency: 'ETB',
    images: ['https://example.com/image4.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    category: 'plain',
    material: 'Nida',
    careInstructions: 'Machine wash',
    inStock: true,
    featured: false,
  },
];

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

describe('ProductCatalog', () => {
  let mockOnCategoryChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnCategoryChange = vi.fn();
    // Setup IntersectionObserver mock
    global.IntersectionObserver = MockIntersectionObserver as any;
  });

  it('renders all products when no category is selected', () => {
    render(
      <ProductCatalog
        products={mockProducts}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByText('Black Casual Abaya')).toBeInTheDocument();
    expect(screen.getByText('Navy Formal Abaya')).toBeInTheDocument();
    expect(screen.getByText('Embroidered Abaya')).toBeInTheDocument();
    expect(screen.getByText('Plain Black Abaya')).toBeInTheDocument();
  });

  it('displays correct product count', () => {
    render(
      <ProductCatalog
        products={mockProducts}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByText('4 products found')).toBeInTheDocument();
  });

  it('displays singular "product" when count is 1', () => {
    render(
      <ProductCatalog
        products={[mockProducts[0]]}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByText('1 product found')).toBeInTheDocument();
  });

  it('renders category filter buttons', () => {
    render(
      <ProductCatalog
        products={mockProducts}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByRole('button', { name: /filter by all category/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter by casual category/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter by formal category/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter by embroidered category/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter by plain category/i })).toBeInTheDocument();
  });

  it('calls onCategoryChange when category button is clicked', () => {
    render(
      <ProductCatalog
        products={mockProducts}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const casualButton = screen.getByRole('button', { name: /filter by casual category/i });
    fireEvent.click(casualButton);

    expect(mockOnCategoryChange).toHaveBeenCalledWith('casual');
  });

  it('filters products by selected category', () => {
    render(
      <ProductCatalog
        products={mockProducts}
        selectedCategory="casual"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByText('Black Casual Abaya')).toBeInTheDocument();
    expect(screen.queryByText('Navy Formal Abaya')).not.toBeInTheDocument();
    expect(screen.queryByText('Embroidered Abaya')).not.toBeInTheDocument();
    expect(screen.getByText('1 product found')).toBeInTheDocument();
  });

  it('highlights active category button', () => {
    render(
      <ProductCatalog
        products={mockProducts}
        selectedCategory="formal"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const formalButton = screen.getByRole('button', { name: /filter by formal category/i });
    expect(formalButton).toHaveClass('product-catalog__filter-btn--active');
    expect(formalButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows empty state when no products match filter', () => {
    render(
      <ProductCatalog
        products={[]}
        selectedCategory="casual"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByText('No products found in this category.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view all products/i })).toBeInTheDocument();
  });

  it('resets filter when "View All Products" is clicked in empty state', () => {
    render(
      <ProductCatalog
        products={[]}
        selectedCategory="casual"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const resetButton = screen.getByRole('button', { name: /view all products/i });
    fireEvent.click(resetButton);

    expect(mockOnCategoryChange).toHaveBeenCalledWith('all');
  });

  it('renders products in a grid with proper role attributes', () => {
    render(
      <ProductCatalog
        products={mockProducts}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const grid = screen.getByRole('list');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('product-catalog__grid');

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(4);
  });

  it('sets up IntersectionObserver for scroll animations', () => {
    render(
      <ProductCatalog
        products={mockProducts}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(global.IntersectionObserver).toHaveBeenCalled();
  });

  it('has accessible filter navigation', () => {
    render(
      <ProductCatalog
        products={mockProducts}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const filterNav = screen.getByRole('navigation', { name: /product category filters/i });
    expect(filterNav).toBeInTheDocument();
  });

  it('updates product count when category changes', () => {
    const { rerender } = render(
      <ProductCatalog
        products={mockProducts}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByText('4 products found')).toBeInTheDocument();

    rerender(
      <ProductCatalog
        products={mockProducts}
        selectedCategory="formal"
        onCategoryChange={mockOnCategoryChange}
      />
    );

    expect(screen.getByText('1 product found')).toBeInTheDocument();
  });

  it('handles keyboard navigation on filter buttons', () => {
    render(
      <ProductCatalog
        products={mockProducts}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const casualButton = screen.getByRole('button', { name: /filter by casual category/i });
    casualButton.focus();
    
    expect(document.activeElement).toBe(casualButton);
  });

  it('displays all categories from products', () => {
    render(
      <ProductCatalog
        products={mockProducts}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    // Should have 'all' + 4 unique categories
    const buttons = screen.getAllByRole('button', { name: /filter by/i });
    expect(buttons).toHaveLength(5); // all, casual, formal, embroidered, plain
  });

  it('maintains "all" as default when no category selected', () => {
    render(
      <ProductCatalog
        products={mockProducts}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    const allButton = screen.getByRole('button', { name: /filter by all category/i });
    expect(allButton).toHaveClass('product-catalog__filter-btn--active');
  });

  it('renders ProductCard components for each product', () => {
    render(
      <ProductCatalog
        products={mockProducts}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    // Check that product names are rendered (ProductCard renders product names)
    mockProducts.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it('passes correct props to ProductCard components', () => {
    render(
      <ProductCatalog
        products={[mockProducts[0]]}
        onCategoryChange={mockOnCategoryChange}
      />
    );

    // Verify product details are displayed (via ProductCard)
    expect(screen.getByText('Black Casual Abaya')).toBeInTheDocument();
    expect(screen.getByText('ETB 1,200')).toBeInTheDocument();
  });
});
