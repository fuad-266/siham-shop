import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from './ProductCard';
import { Product } from '../types/models';

// Mock product data
const mockProduct: Product = {
  id: 'test-001',
  name: 'Test Abaya',
  description: 'A beautiful test abaya',
  price: 1200,
  currency: 'ETB',
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['Black', 'Navy'],
  category: 'casual',
  material: 'Premium Nida fabric',
  careInstructions: 'Machine wash cold',
  inStock: true,
  featured: false,
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const onProductClick = vi.fn();
    render(<ProductCard product={mockProduct} onProductClick={onProductClick} />);

    // Check product name
    expect(screen.getByText('Test Abaya')).toBeInTheDocument();

    // Check price
    expect(screen.getByText('ETB 1,200')).toBeInTheDocument();

    // Check sizes
    expect(screen.getByText('S, M, L, XL')).toBeInTheDocument();

    // Check category
    expect(screen.getByText('casual')).toBeInTheDocument();
  });

  it('displays product image with correct alt text', () => {
    const onProductClick = vi.fn();
    render(<ProductCard product={mockProduct} onProductClick={onProductClick} />);

    const image = screen.getByAltText('Test Abaya');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('calls onProductClick when card is clicked', async () => {
    const user = userEvent.setup();
    const onProductClick = vi.fn();
    render(<ProductCard product={mockProduct} onProductClick={onProductClick} />);

    const card = screen.getByRole('button', { name: /View details for Test Abaya/i });
    await user.click(card);

    expect(onProductClick).toHaveBeenCalledWith('test-001');
    expect(onProductClick).toHaveBeenCalledTimes(1);
  });

  it('calls onProductClick when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const onProductClick = vi.fn();
    render(<ProductCard product={mockProduct} onProductClick={onProductClick} />);

    const card = screen.getByRole('button', { name: /View details for Test Abaya/i });
    card.focus();
    await user.keyboard('{Enter}');

    expect(onProductClick).toHaveBeenCalledWith('test-001');
  });

  it('calls onProductClick when Space key is pressed', async () => {
    const user = userEvent.setup();
    const onProductClick = vi.fn();
    render(<ProductCard product={mockProduct} onProductClick={onProductClick} />);

    const card = screen.getByRole('button', { name: /View details for Test Abaya/i });
    card.focus();
    await user.keyboard(' ');

    expect(onProductClick).toHaveBeenCalledWith('test-001');
  });

  it('displays "Out of Stock" badge when product is not in stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    const onProductClick = vi.fn();
    render(<ProductCard product={outOfStockProduct} onProductClick={onProductClick} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('does not display "Out of Stock" badge when product is in stock', () => {
    const onProductClick = vi.fn();
    render(<ProductCard product={mockProduct} onProductClick={onProductClick} />);

    expect(screen.queryByText('Out of Stock')).not.toBeInTheDocument();
  });

  it('displays "Featured" badge when product is featured', () => {
    const featuredProduct = { ...mockProduct, featured: true };
    const onProductClick = vi.fn();
    render(<ProductCard product={featuredProduct} onProductClick={onProductClick} />);

    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('does not display "Featured" badge when product is not featured', () => {
    const onProductClick = vi.fn();
    render(<ProductCard product={mockProduct} onProductClick={onProductClick} />);

    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });

  it('formats price correctly with currency', () => {
    const onProductClick = vi.fn();
    render(<ProductCard product={mockProduct} onProductClick={onProductClick} />);

    // Check that price includes currency and is formatted with comma
    expect(screen.getByText('ETB 1,200')).toBeInTheDocument();
  });

  it('displays all available sizes', () => {
    const onProductClick = vi.fn();
    render(<ProductCard product={mockProduct} onProductClick={onProductClick} />);

    expect(screen.getByText('Sizes:')).toBeInTheDocument();
    expect(screen.getByText('S, M, L, XL')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const onProductClick = vi.fn();
    render(<ProductCard product={mockProduct} onProductClick={onProductClick} />);

    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('aria-label');
  });

  it('renders with different product categories', () => {
    const categories = ['casual', 'formal', 'embroidered', 'plain'];
    const onProductClick = vi.fn();

    categories.forEach((category) => {
      const { unmount } = render(
        <ProductCard
          product={{ ...mockProduct, category }}
          onProductClick={onProductClick}
        />
      );
      expect(screen.getByText(category)).toBeInTheDocument();
      unmount();
    });
  });

  it('handles products with single size', () => {
    const singleSizeProduct = { ...mockProduct, sizes: ['M'] };
    const onProductClick = vi.fn();
    render(<ProductCard product={singleSizeProduct} onProductClick={onProductClick} />);

    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('handles products with many sizes', () => {
    const manySizesProduct = { ...mockProduct, sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] };
    const onProductClick = vi.fn();
    render(<ProductCard product={manySizesProduct} onProductClick={onProductClick} />);

    expect(screen.getByText('XS, S, M, L, XL, XXL')).toBeInTheDocument();
  });

  it('handles large price values correctly', () => {
    const expensiveProduct = { ...mockProduct, price: 15000 };
    const onProductClick = vi.fn();
    render(<ProductCard product={expensiveProduct} onProductClick={onProductClick} />);

    expect(screen.getByText('ETB 15,000')).toBeInTheDocument();
  });

  it('wraps ZoomAnimation component around image container', () => {
    const onProductClick = vi.fn();
    const { container } = render(
      <ProductCard product={mockProduct} onProductClick={onProductClick} />
    );

    // Check that image container is wrapped by motion div (from ZoomAnimation)
    const imageContainer = container.querySelector('.product-card__image-container');
    expect(imageContainer?.parentElement?.tagName.toLowerCase()).toBe('div');
  });
});
