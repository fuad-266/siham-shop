'use client';

import React, { useEffect, useState, useCallback, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, Search, ChevronDown, X } from 'lucide-react';
import { productsApi, categoriesApi } from '@/lib/api';
import { Product, Category, PaginatedResponse } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [meta, setMeta] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showMobileSort, setShowMobileSort] = useState(false);

    // Filters from URL
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: Record<string, any> = { page, limit: 12 };
            if (category) params.category = category;
            if (search) params.search = search;
            if (sort === 'newest') params.sort = 'newest';
            else if (sort === 'price-asc') params.sort = 'price_asc';
            else if (sort === 'price-desc') params.sort = 'price_desc';

            const { data } = await productsApi.list(params);
            setProducts(data.data || []);
            setMeta(data.meta);
        } catch {
            setProducts([]);
        }
        setIsLoading(false);
    }, [category, sort, search, page]);

    useEffect(() => {
        fetchProducts();
        categoriesApi.list().then(({ data }) => setCategories(data)).catch(() => { });
    }, [fetchProducts]);

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        if (key !== 'page') params.delete('page');
        router.push(`/products?${params.toString()}`);
    };

    const sortLabels: Record<string, string> = {
        'newest': 'Newest',
        'price-asc': 'Price ↑',
        'price-desc': 'Price ↓',
    };

    return (
        <div className="pt-24 md:pt-28 pb-20 min-h-screen bg-brand-50/30">
            <div className="container mx-auto px-4">

                {/* ── Mobile Header ── */}
                <div className="mb-6 md:mb-10">
                    <h1 className="text-2xl md:text-5xl font-display font-semibold text-brand-950 mb-1 md:mb-3">
                        {category ? categories.find(c => c.slug === category)?.name || 'Shop' : 'Explore Fashion'}
                    </h1>
                    <p className="text-sm md:text-base text-brand-500">
                        {meta?.total ? `${meta.total} products found` : 'Loading...'}
                    </p>
                </div>

                {/* ── Search Bar + Filter ── */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            defaultValue={search}
                            onChange={(e) => {
                                const timeoutId = setTimeout(() => updateParam('q', e.target.value), 500);
                                return () => clearTimeout(timeoutId);
                            }}
                            className="w-full pl-11 pr-4 py-3 md:py-3.5 text-sm bg-white border border-brand-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none shadow-sm transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setShowMobileSort(!showMobileSort)}
                        className={cn(
                            'shrink-0 w-12 h-12 md:w-auto md:px-4 md:h-auto md:py-3 rounded-2xl flex items-center justify-center md:gap-2 border transition-all shadow-sm',
                            showMobileSort
                                ? 'bg-brand-600 text-white border-brand-600'
                                : 'bg-white border-brand-100 text-brand-700 hover:bg-brand-50'
                        )}
                    >
                        <SlidersHorizontal size={18} />
                        <span className="hidden md:inline text-sm font-medium">Sort</span>
                    </button>
                </div>

                {/* ── Sort Options (collapsible) ── */}
                <AnimatePresence>
                    {showMobileSort && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-4"
                        >
                            <div className="flex gap-2 flex-wrap pb-2">
                                {Object.entries(sortLabels).map(([value, label]) => (
                                    <button
                                        key={value}
                                        onClick={() => { updateParam('sort', value); setShowMobileSort(false); }}
                                        className={cn(
                                            'px-4 py-2 rounded-full text-sm font-medium transition-all',
                                            sort === value
                                                ? 'bg-brand-600 text-white shadow-sm'
                                                : 'bg-white text-brand-600 border border-brand-200 hover:bg-brand-50'
                                        )}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Category Pills (horizontally scrollable) ── */}
                <div
                    ref={scrollRef}
                    className="flex gap-2.5 mb-8 overflow-x-auto pb-2 scrollbar-hide"
                    style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <button
                        onClick={() => updateParam('category', '')}
                        className={cn(
                            'shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                            !category
                                ? 'bg-brand-600 text-white shadow-md'
                                : 'bg-white text-brand-700 border border-brand-200 hover:bg-brand-50'
                        )}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => updateParam('category', cat.slug)}
                            className={cn(
                                'shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                                category === cat.slug
                                    ? 'bg-brand-600 text-white shadow-md'
                                    : 'bg-white text-brand-700 border border-brand-200 hover:bg-brand-50'
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* ── Products Grid ── */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl animate-pulse shadow-sm">
                                <div className="aspect-[3/4] bg-brand-100 rounded-t-2xl" />
                                <div className="p-3 space-y-2">
                                    <div className="h-3 bg-brand-100 rounded-full w-3/4" />
                                    <div className="h-3 bg-brand-100 rounded-full w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product, idx) => (
                            <ProductCard key={product.id} product={product} index={idx} />
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-brand-200">
                        <p className="text-brand-500 text-base mb-3">No products found matching your criteria.</p>
                        <button onClick={() => router.push('/products')} className="text-brand-600 font-semibold hover:underline text-sm">
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* ── Pagination ── */}
                {meta && meta.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        {Array.from({ length: meta.totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => updateParam('page', String(i + 1))}
                                className={cn(
                                    'w-10 h-10 rounded-full text-sm font-medium transition-all',
                                    page === i + 1
                                        ? 'bg-brand-600 text-white shadow-md'
                                        : 'bg-white text-brand-700 hover:bg-brand-50 border border-brand-100'
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="pt-28 pb-20 min-h-screen bg-brand-50/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
