import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartNotification.css';

interface CartNotificationProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

/**
 * CartNotification Component
 *
 * Displays a confirmation toast when an item is added to cart.
 * Shows "View Cart" link and auto-dismisses after 3 seconds.
 * Requirements: 4.2
 */
export const CartNotification: React.FC<CartNotificationProps> = ({
    message,
    isVisible,
    onClose,
}) => {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isVisible) {
            setShow(true);
            const timer = window.setTimeout(() => {
                setShow(false);
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
            return undefined;
        }
    }, [isVisible, onClose]);

    if (!show) return null;

    const handleViewCart = () => {
        setShow(false);
        onClose();
        navigate('/cart');
    };

    return (
        <div className="cart-notification" role="alert" aria-live="polite">
            <span className="cart-notification__icon">✓</span>
            <div className="cart-notification__body">
                <span className="cart-notification__message">{message}</span>
                <button className="cart-notification__view-cart" onClick={handleViewCart}>
                    View Cart →
                </button>
            </div>
            <button
                className="cart-notification__close"
                onClick={() => { setShow(false); onClose(); }}
                aria-label="Dismiss notification"
            >
                ×
            </button>
        </div>
    );
};
