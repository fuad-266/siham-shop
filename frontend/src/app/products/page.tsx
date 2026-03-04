'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react';
import { productsApi, categoriesApi } from '@/lib/api';
import { Product, Category, PaginatedResponse } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [meta, setMeta] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filters from URL
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: Record<string, any> = { page, limit: 12 };
            if (category) params.categorySlug = category;
            if (search) params.search = search;
            if (sort === 'newest') params.sortBy = 'createdAt';
            else if (sort === 'price-asc') { params.sortBy = 'price'; params.sortOrder = 'asc'; }
            else if (sort === 'price-desc') { params.sortBy = 'price'; params.sortOrder = 'desc'; }

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

    return (
        <div className="pt-28 pb-20 min-h-screen bg-brand-50/50">
            <div className="container mx-auto px-4">
                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-display font-semibold text-brand-950 mb-3">
                        {category ? categories.find(c => c.slug === category)?.name || 'Shop' : 'Shop All'}
                    </h1>
                    <p className="text-brand-600">
                        {meta?.total ? `${meta.total} products found` : 'Loading...'}
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-brand-100">
                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
                                showFilters ? 'bg-brand-950 text-white border-brand-950' : 'border-brand-200 hover:bg-brand-50'
                            )}
                        >
                            <SlidersHorizontal size={16} /> Filters
                        </button>

                        {/* Category Pills */}
                        <button
                            onClick={() => updateParam('category', '')}
                            className={cn(
                                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                                !category ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                            )}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => updateParam('category', cat.slug)}
                                className={cn(
                                    'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                                    category === cat.slug ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                defaultValue={search}
                                onChange={(e) => {
                                    const timeoutId = setTimeout(() => updateParam('q', e.target.value), 500);
                                    return () => clearTimeout(timeoutId);
                                }}
                                className="pl-10 pr-4 py-2 text-sm border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none w-48"
                            />
                        </div>
                        <select
                            value={sort}
                            onChange={(e) => updateParam('sort', e.target.value)}
                            className="px-4 py-2 text-sm border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none appearance-none bg-white cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-xl animate-pulse">
                                <div className="aspect-[3/4] bg-brand-100 rounded-t-xl" />
                                <div className="p-5 space-y-3">
                                    <div className="h-3 bg-brand-100 rounded w-1/2" />
                                    <div className="h-4 bg-brand-100 rounded w-3/4" />
                                    <div className="h-4 bg-brand-100 rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {products.map((product, idx) => (
                            <ProductCard key={product.id} product={product} index={idx} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-brand-200">
                        <p className="text-brand-500 text-lg">No products found matching your criteria.</p>
                        <button onClick={() => router.push('/products')} className="mt-4 text-brand-600 font-semibold hover:underline">
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        {Array.from({ length: meta.totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => updateParam('page', String(i + 1))}
                                className={cn(
                                    'w-10 h-10 rounded-full text-sm font-medium transition-colors',
                                    page === i + 1 ? 'bg-brand-600 text-white' : 'bg-white text-brand-700 hover:bg-brand-100 border border-brand-100'
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
