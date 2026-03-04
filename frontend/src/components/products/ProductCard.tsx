'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Eye, Star } from 'lucide-react';
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
    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1, product.sizes[0], product.colors[0]);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-white rounded-xl overflow-hidden border border-brand-100 hover:shadow-2xl transition-all duration-500"
        >
            {/* Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-brand-50">
                <Link href={`/products/${product.slug}`}>
                    <Image
                        src={primaryImage?.imageUrl || 'https://via.placeholder.com/600x800?text=No+Image'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.featured && (
                        <span className="bg-gold-500 text-brand-950 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                            Featured
                        </span>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                            Low Stock
                        </span>
                    )}
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-brand-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Link
                        href={`/products/${product.slug}`}
                        className="p-3 bg-white text-brand-950 rounded-full hover:bg-gold-500 hover:text-brand-950 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg"
                    >
                        <Eye size={20} />
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        className="p-3 bg-brand-950 text-white rounded-full hover:bg-gold-500 hover:text-brand-950 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg delay-75"
                    >
                        <ShoppingBag size={20} />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 md:p-5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400">
                        {product.category.name}
                    </span>
                    <div className="flex items-center text-gold-500 gap-0.5">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-semibold text-brand-600">4.9</span>
                    </div>
                </div>

                <Link href={`/products/${product.slug}`}>
                    <h3 className="text-sm md:text-base font-semibold text-brand-950 group-hover:text-brand-600 transition-colors line-clamp-1 mb-1">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-3">
                    <span className="text-base md:text-lg font-bold text-brand-900">
                        {formatPrice(product.price)}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        className="text-xs font-bold text-brand-600 hover:text-gold-600 transition-colors uppercase tracking-wider"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
