'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Package, ShoppingCart, Layers, Users, BarChart3,
    Menu, X, ChevronLeft, LogOut, Store,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';

const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Users', href: '/admin/users', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const { dbUser, signOut } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 bg-brand-950 text-white flex flex-col transition-all duration-300 shadow-2xl',
                    sidebarOpen ? 'w-64' : 'w-20'
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-brand-800">
                    {sidebarOpen && (
                        <Link href="/admin" className="font-display text-lg font-semibold tracking-tight">
                            ALORA <span className="text-gold-500">ADMIN</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 text-brand-400 hover:text-white rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-grow py-6 space-y-1 px-3">
                    {adminLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all',
                                    isActive
                                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                                        : 'text-brand-300 hover:bg-brand-900 hover:text-white'
                                )}
                            >
                                <link.icon size={20} className="shrink-0" />
                                {sidebarOpen && <span>{link.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t border-brand-800 p-4 space-y-3">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2 text-brand-300 hover:text-white transition-colors text-sm rounded-lg hover:bg-brand-900"
                    >
                        <Store size={18} /> {sidebarOpen && 'View Storefront'}
                    </Link>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-3 px-3 py-2 text-brand-400 hover:text-red-400 transition-colors text-sm rounded-lg hover:bg-brand-900 w-full"
                    >
                        <LogOut size={18} /> {sidebarOpen && 'Sign Out'}
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className={cn('flex-grow transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-20')}>
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">Welcome, {dbUser?.name || 'Admin'}</h2>
                        <p className="text-xs text-gray-500">Manage your store from here</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {dbUser?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
