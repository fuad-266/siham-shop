import { useState, useEffect, useRef } from 'react';
import { Product } from '../types/models';
import { ProductCard } from './ProductCard';
import './ProductCatalog.css';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
}

/**
 * ProductCatalog Component
 * 
 * Displays grid of product cards with category filtering.
 * Features:
 * - Responsive grid layout (4 columns desktop, 2 tablet, 1 mobile)
 * - Intersection Observer for scroll-triggered zoom animations
 * - Category filter buttons
 * - Loading states with animated skeletons
 * 
 * Requirements: 1.1, 1.3, 1.4, 1.5
 */
export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onCategoryChange,
}) => {
  const [visibleProducts, setVisibleProducts] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const productRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Get unique categories from products
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products by selected category
  const filteredProducts = selectedCategory && selectedCategory !== 'all'
    ? products.filter(p => p.category === selectedCategory)
    : products;

  // Set up Intersection Observer for scroll-triggered animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productId = entry.target.getAttribute('data-product-id');
            if (productId) {
              setVisibleProducts((prev) => new Set(prev).add(productId));
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    // Observe all product elements
    productRefs.current.forEach((element) => {
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [filteredProducts]);

  // Handle product ref assignment
  const setProductRef = (productId: string, element: HTMLDivElement | null) => {
    if (element) {
      productRefs.current.set(productId, element);
    } else {
      productRefs.current.delete(productId);
    }
  };

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
  };

  const handleProductClick = (productId: string) => {
    // This will be handled by parent component or router
    console.log('Product clicked:', productId);
  };

  return (
    <div className="product-catalog">
      {/* Category Filter Buttons */}
      <div className="product-catalog__filters" role="navigation" aria-label="Product category filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`product-catalog__filter-btn ${
              (selectedCategory || 'all') === category ? 'product-catalog__filter-btn--active' : ''
            }`}
            onClick={() => handleCategoryClick(category)}
            aria-pressed={(selectedCategory || 'all') === category}
            aria-label={`Filter by ${category} category`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Product Count */}
      <div className="product-catalog__count" aria-live="polite">
        {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
      </div>

      {/* Product Grid */}
      <div className="product-catalog__grid" role="list">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            ref={(el) => setProductRef(product.id, el)}
            data-product-id={product.id}
            className={`product-catalog__item ${
              visibleProducts.has(product.id) ? 'product-catalog__item--visible' : ''
            }`}
            role="listitem"
          >
            <ProductCard
              product={product}
              onProductClick={handleProductClick}
              inView={visibleProducts.has(product.id)}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="product-catalog__empty" role="status">
          <p>No products found in this category.</p>
          <button
            className="product-catalog__reset-btn"
            onClick={() => handleCategoryClick('all')}
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
};
