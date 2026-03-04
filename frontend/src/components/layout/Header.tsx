'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Menu, X, Search, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useCart } from '@/providers/cart-provider';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, dbUser, signOut } = useAuth();
    const { totalItems } = useCart();

    const isAdmin = dbUser?.role === 'ADMIN';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Shop All', href: '/products' },
        { name: 'New Arrivals', href: '/products?sort=newest' },
        { name: 'Casual', href: '/products?category=casual' },
        { name: 'Formal', href: '/products?category=formal' },
    ];

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
                isScrolled
                    ? 'glass py-3 border-brand-100 shadow-sm'
                    : 'bg-white py-5 border-transparent'
            )}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="p-2 -ml-2 text-brand-900 md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-2xl font-display font-semibold tracking-tight text-brand-950 group-hover:text-brand-700 transition-colors">
                            ALORA <span className="text-gold-600">ABAYAS</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-brand-600',
                                    pathname === link.href ? 'text-brand-700' : 'text-brand-900/70'
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <button className="p-2 text-brand-900 hover:text-brand-600 transition-colors hidden sm:block">
                            <Search size={20} />
                        </button>

                        {user ? (
                            <div className="relative group">
                                <Link
                                    href={isAdmin ? '/admin' : '/profile'}
                                    className="p-2 text-brand-900 hover:text-brand-600 transition-colors flex items-center gap-1"
                                >
                                    <User size={20} />
                                    <span className="hidden lg:inline text-sm font-medium">
                                        {dbUser?.name?.split(' ')[0] || 'Profile'}
                                    </span>
                                </Link>

                                {/* Profile Dropdown */}
                                <div className="absolute right-0 mt-1 w-48 bg-white border border-brand-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="py-2">
                                        {isAdmin && (
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-brand-900 hover:bg-brand-50"
                                            >
                                                <LayoutDashboard size={16} /> Admin Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-brand-900 hover:bg-brand-50"
                                        >
                                            <User size={16} /> My Profile
                                        </Link>
                                        <Link
                                            href="/orders"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-brand-900 hover:bg-brand-50"
                                        >
                                            <ShoppingBag size={16} /> My Orders
                                        </Link>
                                        <hr className="my-1 border-brand-50" />
                                        <button
                                            onClick={signOut}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                                        >
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="p-2 text-brand-900 hover:text-brand-600 transition-colors flex items-center gap-1"
                            >
                                <User size={20} />
                                <span className="hidden sm:inline text-sm font-medium">Login</span>
                            </Link>
                        )}

                        <Link href="/cart" className="p-2 text-brand-900 hover:text-brand-600 transition-colors relative">
                            <ShoppingBag size={20} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-brand-50 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        'text-lg font-medium py-2',
                                        pathname === link.href ? 'text-brand-700' : 'text-brand-900'
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-brand-50" />
                            {user ? (
                                <>
                                    {isAdmin && (
                                        <Link href="/admin" className="text-lg font-medium py-2 text-brand-900">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <Link href="/profile" className="text-lg font-medium py-2 text-brand-900">
                                        Profile
                                    </Link>
                                    <Link href="/orders" className="text-lg font-medium py-2 text-brand-900">
                                        My Orders
                                    </Link>
                                    <button
                                        onClick={signOut}
                                        className="text-lg font-medium py-2 text-red-600 text-left"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link href="/auth/login" className="text-lg font-medium py-2 text-brand-900">
                                    Login / Register
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
