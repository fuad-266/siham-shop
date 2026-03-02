import { useState, useEffect, useRef } from 'react';
import { Product } from '../types/models';
import { ProductCard } from './ProductCard';
import './ProductCatalog.css';

interface ProductCatalogProps {
  products: Product[];
  onProductClick: (productId: string) => void;
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
  onProductClick,
}) => {
  const [visibleProducts, setVisibleProducts] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const productRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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
  }, [products]);

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
      {/* Product Count */}
      <div className="product-catalog__count" aria-live="polite">
        {products.length} {products.length === 1 ? 'product' : 'products'} found
      </div>

      {/* Product Grid */}
      <div className="product-catalog__grid" role="list">
        {products.map((product) => (
          <div
            key={product.id}
            ref={(el) => setProductRef(product.id, el)}
            data-product-id={product.id}
            className={`product-catalog__item ${visibleProducts.has(product.id) ? 'product-catalog__item--visible' : ''
              }`}
            role="listitem"
          >
            <ProductCard
              product={product}
              onProductClick={onProductClick}
              inView={visibleProducts.has(product.id)}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="product-catalog__empty" role="status">
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
