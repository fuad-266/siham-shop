'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ArrowUpRight, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import { useCart } from '@/providers/cart-provider';
import { motion } from 'framer-motion';

interface ProductCardProps {
    product: Product;
    index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const { addItem } = useCart();
    const [isLiked, setIsLiked] = useState(false);
    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1, product.sizes[0], product.colors[0]);
    };

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400"
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-brand-50">
                <Link href={`/products/${product.slug}`}>
                    <Image
                        src={primaryImage?.imageUrl || 'https://via.placeholder.com/600x800?text=No+Image'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </Link>

                {/* Heart / Wishlist Button */}
                <button
                    onClick={handleLike}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all duration-200 z-10"
                >
                    <Heart
                        size={16}
                        className={cn(
                            'transition-colors duration-200',
                            isLiked ? 'fill-red-500 text-red-500' : 'text-brand-400'
                        )}
                    />
                </button>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.featured && (
                        <span className="bg-brand-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Featured
                        </span>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Low Stock
                        </span>
                    )}
                </div>

                {/* Quick Add Button */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg hover:bg-brand-700 active:scale-90 transition-all duration-200 z-10"
                >
                    <ArrowUpRight size={18} />
                </button>
            </div>

            {/* Product Info */}
            <div className="p-3 md:p-4">
                <Link href={`/products/${product.slug}`}>
                    <h3 className="text-sm font-semibold text-brand-950 line-clamp-1 mb-1 group-hover:text-brand-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-1.5">
                    <span className="text-sm md:text-base font-bold text-brand-900">
                        {formatPrice(product.price)}
                    </span>
                    <div className="flex items-center gap-0.5 text-gold-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-[11px] font-semibold text-brand-500">5.0</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
