'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WishlistPage() {
    return (
        <div className="pt-24 md:pt-28 pb-24 min-h-screen bg-brand-50/30">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl md:text-4xl font-display font-semibold text-brand-950 mb-2">
                    Favorites
                </h1>
                <p className="text-sm text-brand-500 mb-10">Your saved items</p>

                {/* Empty State */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-brand-200"
                >
                    <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mb-6">
                        <Heart size={36} className="text-brand-300" />
                    </div>
                    <h2 className="text-lg font-semibold text-brand-900 mb-2">No favorites yet</h2>
                    <p className="text-sm text-brand-500 mb-6 text-center max-w-xs">
                        Tap the heart icon on any product to save it here for later.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-brand-700 active:scale-95 transition-all"
                    >
                        <ShoppingBag size={18} />
                        Browse Products
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
