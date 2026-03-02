import './ProductSkeleton.css';

interface ProductSkeletonProps {
    count?: number;
}

/**
 * ProductSkeleton Component
 *
 * Displays skeleton loading screens for the product catalog grid.
 * Mimics the shape of ProductCard components.
 *
 * Requirements: 8.3
 */
const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 8 }) => {
    return (
        <div className="product-skeleton-grid" aria-busy="true" aria-label="Loading products">
            {Array.from({ length: count }).map((_, index) => (
                <div className="product-skeleton" key={index}>
                    <div className="product-skeleton__image" />
                    <div className="product-skeleton__content">
                        <div className="product-skeleton__line product-skeleton__line--title" />
                        <div className="product-skeleton__line product-skeleton__line--price" />
                        <div className="product-skeleton__line product-skeleton__line--sizes" />
                        <div className="product-skeleton__line product-skeleton__line--badge" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductSkeleton;
