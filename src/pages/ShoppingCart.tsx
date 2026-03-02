import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { ZoomAnimation } from '../components/ZoomAnimation';
import LazyImage from '../components/LazyImage';
import './ShoppingCart.css';

/**
 * ShoppingCart Page
 *
 * Displays cart items with quantity controls, price summary, and checkout button.
 * Requirements: 4.3, 4.4, 4.5, 5.1
 */
const ShoppingCart = () => {
    const navigate = useNavigate();
    const { items, removeItem, updateQuantity, clearCart, subtotal, shippingCost, total } = useCart();

    if (items.length === 0) {
        return (
            <div className="shopping-cart shopping-cart--empty">
                <h2>Your Cart is Empty</h2>
                <p>Discover our beautiful collection of abayas.</p>
                <button onClick={() => navigate('/')} className="shopping-cart__browse-btn">
                    Browse Abayas
                </button>
            </div>
        );
    }

    return (
        <div className="shopping-cart">
            <button onClick={() => navigate('/')} className="shopping-cart__back-btn">
                &larr; Continue Shopping
            </button>

            <h1 className="shopping-cart__title">Shopping Cart</h1>

            <div className="shopping-cart__layout">
                {/* Cart Items */}
                <div className="shopping-cart__items" aria-live="polite">
                    {items.map((item) => (
                        <div key={item.id} className="shopping-cart__item">
                            <LazyImage
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="shopping-cart__item-img"
                                onClick={() => navigate(`/product/${item.productId}`)}
                            />
                            <div className="shopping-cart__item-info">
                                <h3 className="shopping-cart__item-name">{item.product.name}</h3>
                                <p className="shopping-cart__item-options">
                                    Size: {item.selectedSize} &middot; Color: {item.selectedColor}
                                </p>
                                <p className="shopping-cart__item-price">
                                    {item.product.currency} {item.product.price.toLocaleString()}
                                </p>
                            </div>
                            <div className="shopping-cart__item-controls">
                                <div className="shopping-cart__quantity">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        aria-label="Decrease quantity"
                                        className="shopping-cart__qty-btn"
                                    >
                                        &minus;
                                    </button>
                                    <span className="shopping-cart__qty-value" aria-label={`Quantity: ${item.quantity}`}>
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        aria-label="Increase quantity"
                                        className="shopping-cart__qty-btn"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="shopping-cart__item-total">
                                    {item.product.currency} {(item.product.price * item.quantity).toLocaleString()}
                                </p>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="shopping-cart__remove-btn"
                                    aria-label={`Remove ${item.product.name}`}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <button onClick={clearCart} className="shopping-cart__clear-btn" aria-label="Clear all items from cart">
                        Clear Cart
                    </button>
                </div>

                {/* Order Summary */}
                <div className="shopping-cart__summary">
                    <h2 className="shopping-cart__summary-title">Order Summary</h2>
                    <div className="shopping-cart__summary-row">
                        <span>Subtotal</span>
                        <span>ETB {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="shopping-cart__summary-row">
                        <span>Shipping</span>
                        <span>ETB {shippingCost.toLocaleString()}</span>
                    </div>
                    <div className="shopping-cart__summary-row shopping-cart__summary-row--total">
                        <span>Total</span>
                        <span>ETB {total.toLocaleString()}</span>
                    </div>
                    <ZoomAnimation trigger="hover" scale={1.02} duration={0.2}>
                        <button
                            className="shopping-cart__checkout-btn"
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Checkout
                        </button>
                    </ZoomAnimation>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;
