import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { CartItem, Product } from '../types/models';

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, selectedSize: string, selectedColor: string) => void;
    removeItem: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    subtotal: number;
    shippingCost: number;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'alora-abayas-cart';
const SHIPPING_COST = 150; // ETB flat rate

/**
 * Load cart from localStorage
 * Handles errors gracefully (Requirement 4.6)
 */
const loadCartFromStorage = (): CartItem[] => {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Restore Date objects
            return parsed.map((item: CartItem) => ({
                ...item,
                addedAt: new Date(item.addedAt),
            }));
        }
    } catch (error) {
        console.warn('Failed to load cart from localStorage:', error);
    }
    return [];
};

/**
 * Save cart to localStorage (debounced)
 * Handles errors gracefully (Requirement 4.6)
 */
const saveCartToStorage = (items: CartItem[]) => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.warn('Failed to save cart to localStorage:', error);
    }
};

/**
 * CartProvider Component
 *
 * Provides cart state management with localStorage persistence.
 * Requirements: 4.1, 4.4, 4.5, 4.6
 */
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);
    const saveTimerRef = useRef<number | null>(null);

    // Debounced save to localStorage (Requirement 4.6)
    useEffect(() => {
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }
        saveTimerRef.current = window.setTimeout(() => {
            saveCartToStorage(items);
        }, 300);

        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, [items]);

    // Add item to cart (Requirement 4.1)
    const addItem = useCallback((product: Product, selectedSize: string, selectedColor: string) => {
        setItems((prev) => {
            // Check if same product with same options already exists
            const existing = prev.find(
                (item) =>
                    item.productId === product.id &&
                    item.selectedSize === selectedSize &&
                    item.selectedColor === selectedColor
            );

            if (existing) {
                return prev.map((item) =>
                    item.id === existing.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            const newItem: CartItem = {
                id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                productId: product.id,
                product,
                selectedSize,
                selectedColor,
                quantity: 1,
                addedAt: new Date(),
            };

            return [...prev, newItem];
        });
    }, []);

    // Remove item from cart (Requirement 4.5)
    const removeItem = useCallback((cartItemId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== cartItemId));
    }, []);

    // Update quantity (Requirement 4.4)
    const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
        if (quantity < 1) return;
        setItems((prev) =>
            prev.map((item) =>
                item.id === cartItemId ? { ...item, quantity } : item
            )
        );
    }, []);

    // Clear entire cart
    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    // Calculate totals
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shippingCost = items.length > 0 ? SHIPPING_COST : 0;
    const total = subtotal + shippingCost;

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                itemCount,
                subtotal,
                shippingCost,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

/**
 * useCart Hook
 *
 * Access cart state and actions from any component.
 */
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
