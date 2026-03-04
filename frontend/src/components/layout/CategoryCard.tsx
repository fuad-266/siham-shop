'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
    name: string;
    slug: string;
    image: string;
    count?: number;
    index?: number;
}

export default function CategoryCard({ name, slug, image, count, index = 0 }: CategoryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="group relative h-80 md:h-[450px] rounded-3xl overflow-hidden shadow-xl"
        >
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/20 to-transparent transition-opacity duration-500 group-hover:from-brand-950/95" />

            <div className="absolute inset-0 p-8 flex flex-col justify-end items-start">
                <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 bg-gold-500 text-brand-950 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
                        {count || 0} Products
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-semibold text-white mb-2">
                        {name}
                    </h3>
                    <p className="text-brand-100/80 text-sm md:text-base max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        Discover our exquisite collection of {name.toLowerCase()} abayas designed for your ultimate comfort.
                    </p>
                </div>

                <Link
                    href={`/products?category=${slug}`}
                    className="flex items-center gap-2 text-white font-medium hover:text-gold-500 transition-colors group/btn"
                >
                    Explore Collection <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
}
