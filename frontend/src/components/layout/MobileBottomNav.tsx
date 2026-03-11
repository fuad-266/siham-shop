'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, ShoppingBag, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/providers/cart-provider';
import { motion } from 'framer-motion';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Shop', icon: Store },
    { href: '/wishlist', label: 'Favorite', icon: Heart },
    { href: '/cart', label: 'Cart', icon: ShoppingBag },
];

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { items } = useCart();
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Don't show on admin pages or checkout
    if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) {
        return null;
    }

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
                className="flex items-center gap-1 bg-brand-950/95 backdrop-blur-xl rounded-full px-3 py-2.5 shadow-2xl shadow-brand-950/30"
            >
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300',
                                active
                                    ? 'bg-brand-600 text-white'
                                    : 'text-brand-300 hover:text-white'
                            )}
                        >
                            <div className="relative">
                                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                                {/* Cart badge */}
                                {item.href === '/cart' && cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </div>
                            {active && (
                                <motion.span
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 'auto', opacity: 1 }}
                                    className="text-sm font-semibold whitespace-nowrap overflow-hidden"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </Link>
                    );
                })}
            </motion.div>
        </nav>
    );
}
