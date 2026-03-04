'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem, Product } from '@/types';
import toast from 'react-hot-toast';

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, quantity: number, size: string, color: string) => void;
    removeItem: (productId: string, size: string, color: string) => void;
    updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'alora_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
                localStorage.removeItem(CART_STORAGE_KEY);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save cart to localStorage when it changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isInitialized]);

    const addItem = (product: Product, quantity: number, size: string, color: string) => {
        setItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (item) =>
                    item.productId === product.id &&
                    item.size === size &&
                    item.color === color
            );

            if (existingItemIndex > -1) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                toast.success(`Updated ${product.name} quantity in cart`);
                return newItems;
            }

            toast.success(`Added ${product.name} to cart`);
            return [...prevItems, { productId: product.id, product, quantity, size, color }];
        });
    };

    const removeItem = (productId: string, size: string, color: string) => {
        setItems((prevItems) =>
            prevItems.filter(
                (item) =>
                    !(item.productId === productId && item.size === size && item.color === color)
            )
        );
        toast.success('Item removed from cart');
    };

    const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
        if (quantity < 1) return;

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.productId === productId && item.size === size && item.color === color
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem(CART_STORAGE_KEY);
    };

    const totalItems = useMemo(
        () => items.reduce((total, item) => total + item.quantity, 0),
        [items]
    );

    const totalPrice = useMemo(
        () => items.reduce((total, item) => total + item.product.price * item.quantity, 0),
        [items]
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
