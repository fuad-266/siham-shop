import { Product } from '../types/models';
import { ZoomAnimation } from './ZoomAnimation';
import LazyImage from './LazyImage';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onProductClick: (productId: string) => void;
  inView?: boolean; // Reserved for future scroll-triggered animations
}

/**
 * ProductCard Component
 * 
 * Displays individual product preview with hover zoom effect.
 * Features:
 * - Product image with lazy loading (Requirement 8.2)
 * - Product name, price, available sizes
 * - Hover zoom animation using ZoomAnimation wrapper
 * - Responsive design for mobile/desktop
 * - Accessibility support
 * 
 * Requirements: 1.2, 2.1, 8.2
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductClick,
  inView = true,
}) => {
  const handleClick = () => {
    onProductClick(product.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onProductClick(product.id);
    }
  };

  // Format price with Ethiopian Birr currency
  const formattedPrice = `${product.currency} ${product.price.toLocaleString()}`;

  // Get available sizes as a comma-separated string
  const sizesText = product.sizes.join(', ');

  return (
    <div
      className="product-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.name}, priced at ${formattedPrice}`}
    >
      <ZoomAnimation trigger="hover" scale={1.05} duration={0.3}>
        <div className="product-card__image-container">
          <LazyImage
            src={product.images[0] || ''}
            alt={`${product.name} - ${product.category} abaya, ${formattedPrice}`}
            className="product-card__image"
          />
          {!product.inStock && (
            <div className="product-card__out-of-stock" aria-label="Out of stock">
              Out of Stock
            </div>
          )}
          {product.featured && (
            <div className="product-card__featured-badge" aria-label="Featured product">
              Featured
            </div>
          )}
        </div>
      </ZoomAnimation>

      <div className="product-card__content">
        <h3 className="product-card__name">{product.name}</h3>

        <p className="product-card__price" aria-label={`Price: ${formattedPrice}`}>
          {formattedPrice}
        </p>

        <div className="product-card__sizes">
          <span className="product-card__sizes-label">Sizes:</span>
          <span className="product-card__sizes-list" aria-label={`Available sizes: ${sizesText}`}>
            {sizesText}
          </span>
        </div>

        <div className="product-card__category">
          <span className="product-card__category-badge">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
};
