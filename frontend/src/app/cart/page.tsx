'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/providers/cart-provider';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-brand-50/50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 max-w-sm mx-auto"
                >
                    <div className="w-24 h-24 mx-auto bg-brand-100 rounded-full flex items-center justify-center">
                        <ShoppingBag size={40} className="text-brand-400" />
                    </div>
                    <h2 className="text-2xl font-display font-semibold text-brand-950">Your Cart is Empty</h2>
                    <p className="text-brand-500">Looks like you haven&apos;t added anything yet.</p>
                    <Link href="/products" className="btn-primary inline-flex rounded-full">
                        Start Shopping <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-20 min-h-screen bg-brand-50/50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-4xl font-display font-semibold text-brand-950">Shopping Cart</h1>
                    <span className="text-brand-500">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={`${item.productId}-${item.size}-${item.color}`}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="bg-white rounded-2xl p-4 md:p-6 border border-brand-100 flex gap-4 md:gap-6"
                                >
                                    {/* Image */}
                                    <div className="relative w-24 h-32 md:w-32 md:h-40 rounded-xl overflow-hidden bg-brand-50 shrink-0">
                                        <Image
                                            src={item.product.images[0]?.imageUrl || 'https://via.placeholder.com/200x260'}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                            sizes="128px"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                                        <div>
                                            <Link href={`/products/${item.product.slug}`} className="text-base md:text-lg font-semibold text-brand-950 hover:text-brand-600 transition-colors line-clamp-1">
                                                {item.product.name}
                                            </Link>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-brand-500">
                                                <span>Size: <strong className="text-brand-700">{item.size}</strong></span>
                                                <span>Color: <strong className="text-brand-700">{item.color}</strong></span>
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between mt-4">
                                            <div className="flex items-center border border-brand-200 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                                                    className="p-2 hover:bg-brand-50 transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-10 text-center text-sm font-bold text-brand-950">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                                                    className="p-2 hover:bg-brand-50 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className="text-lg font-bold text-brand-900">
                                                    {formatPrice(item.product.price * item.quantity)}
                                                </span>
                                                <button
                                                    onClick={() => removeItem(item.productId, item.size, item.color)}
                                                    className="p-2 text-brand-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <div className="flex items-center justify-between mt-6">
                            <Link href="/products" className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-900 transition-colors">
                                <ArrowLeft size={16} /> Continue Shopping
                            </Link>
                            <button onClick={clearCart} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-brand-100 p-6 md:p-8 sticky top-28 space-y-6">
                            <h3 className="text-xl font-display font-semibold text-brand-950">Order Summary</h3>

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between text-brand-600">
                                    <span>Subtotal ({totalItems} items)</span>
                                    <span className="font-semibold text-brand-900">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-brand-600">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-green-600">Free</span>
                                </div>
                                <hr className="border-brand-100" />
                                <div className="flex justify-between text-lg font-bold text-brand-950">
                                    <span>Total</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="btn-primary w-full rounded-xl py-4 text-lg">
                                Proceed to Checkout <ArrowRight size={20} />
                            </Link>

                            <div className="text-center">
                                <p className="text-xs text-brand-400">Secure checkout. Free delivery in Addis Ababa.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
