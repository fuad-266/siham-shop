import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../data/products';
import { ImageGallery } from '../components/ImageGallery';
import { ZoomAnimation } from '../components/ZoomAnimation';
import './ProductDetail.css';

/**
 * ProductDetail Page
 *
 * Displays full product information with image gallery, size/color selectors,
 * and "Add to Cart" button.
 * Requirements: 3.1, 3.4, 3.5
 */
const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const product = id ? getProductById(id) : undefined;

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [addedToCart, setAddedToCart] = useState(false);

    if (!product) {
        return (
            <div className="product-detail product-detail--not-found">
                <h2>Product not found</h2>
                <p>The product you're looking for doesn't exist.</p>
                <button onClick={() => navigate('/')} className="product-detail__back-btn">
                    Back to Shop
                </button>
            </div>
        );
    }

    const formattedPrice = `${product.currency} ${product.price.toLocaleString()}`;

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) return;
        // Future: add to cart context
        console.log('Add to cart:', { product: product.id, size: selectedSize, color: selectedColor });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    return (
        <div className="product-detail">
            {/* Back navigation */}
            <button onClick={() => navigate('/')} className="product-detail__back-btn">
                &larr; Back to Shop
            </button>

            <div className="product-detail__layout">
                {/* Left: Image Gallery */}
                <div className="product-detail__gallery">
                    <ImageGallery images={product.images} productName={product.name} />
                </div>

                {/* Right: Product Info */}
                <div className="product-detail__info">
                    <span className="product-detail__category">{product.category}</span>
                    <h1 className="product-detail__name">{product.name}</h1>
                    <p className="product-detail__price">{formattedPrice}</p>
                    <p className="product-detail__description">{product.description}</p>

                    {/* Size Selector (Req 3.5) */}
                    <div className="product-detail__section">
                        <h3 className="product-detail__section-title">Size</h3>
                        <div className="product-detail__options" role="radiogroup" aria-label="Select size">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`product-detail__option ${selectedSize === size ? 'product-detail__option--selected' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                    role="radio"
                                    aria-checked={selectedSize === size}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selector (Req 3.5) */}
                    <div className="product-detail__section">
                        <h3 className="product-detail__section-title">Color</h3>
                        <div className="product-detail__options" role="radiogroup" aria-label="Select color">
                            {product.colors.map((color) => (
                                <button
                                    key={color}
                                    className={`product-detail__option ${selectedColor === color ? 'product-detail__option--selected' : ''}`}
                                    onClick={() => setSelectedColor(color)}
                                    role="radio"
                                    aria-checked={selectedColor === color}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <ZoomAnimation trigger="hover" scale={1.02} duration={0.2}>
                        <button
                            className={`product-detail__add-to-cart ${(!selectedSize || !selectedColor) ? 'product-detail__add-to-cart--disabled' : ''}`}
                            onClick={handleAddToCart}
                            disabled={!selectedSize || !selectedColor}
                            aria-label={`Add ${product.name} to cart`}
                        >
                            {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                        </button>
                    </ZoomAnimation>
                    {(!selectedSize || !selectedColor) && (
                        <p className="product-detail__select-hint">Please select a size and color</p>
                    )}

                    {/* Material & Care */}
                    <div className="product-detail__details">
                        <div className="product-detail__detail-item">
                            <h4>Material</h4>
                            <p>{product.material}</p>
                        </div>
                        <div className="product-detail__detail-item">
                            <h4>Care Instructions</h4>
                            <p>{product.careInstructions}</p>
                        </div>
                    </div>

                    {/* Stock Status */}
                    <div className={`product-detail__stock ${product.inStock ? '' : 'product-detail__stock--out'}`}>
                        {product.inStock ? '● In Stock' : '○ Out of Stock'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
