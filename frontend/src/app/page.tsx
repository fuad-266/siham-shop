import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react';
import { productsApi, categoriesApi } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import CategoryCard from '@/components/layout/CategoryCard';
import { Product, Category } from '@/types';

export const dynamic = 'force-dynamic';

async function getFeaturedProducts(): Promise<Product[]> {
    try {
        const { data } = await productsApi.list({ featured: true, limit: 8 });
        return data.data;
    } catch {
        return [];
    }
}

async function getCategories(): Promise<Category[]> {
    try {
        const { data } = await categoriesApi.list();
        return data;
    } catch {
        return [];
    }
}

export default async function HomePage() {
    const [products, categories] = await Promise.all([
        getFeaturedProducts(),
        getCategories(),
    ]);

    const categoryImages: Record<string, string> = {
        casual: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=800',
        formal: 'https://images.unsplash.com/photo-1621285853634-713b19680320?auto=format&fit=crop&q=80&w=800',
        embroidered: 'https://images.unsplash.com/photo-1609357602329-59301bb58121?auto=format&fit=crop&q=80&w=800',
        plain: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=800',
    };

    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Hero Section */}
            <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden bg-brand-950">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=100&w=1920"
                        alt="Hero Background"
                        fill
                        priority
                        className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/40 to-transparent" />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-2xl space-y-8">
                        <div className="space-y-4">
                            <span className="inline-block px-4 py-1.5 bg-gold-400 text-brand-950 text-xs font-bold uppercase tracking-widest rounded-full animate-fade-in">
                                New Collection 2024
                            </span>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold text-white leading-[1.1] animate-slide-up">
                                Redefining <br />
                                <span className="text-gold-500 italic">Elegance</span>
                            </h1>
                            <p className="text-lg md:text-xl text-brand-100/90 leading-relaxed max-w-lg animate-slide-up">
                                Experience the pinnacle of modest fashion with our handcrafted premium abayas, designed for the modern woman who values grace and quality.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 animate-slide-up">
                            <Link href="/products" className="btn-primary py-4 px-8 text-lg rounded-full">
                                Shop Collection <ArrowRight size={20} />
                            </Link>
                            <Link href="/products?category=casual" className="btn-secondary py-4 px-8 text-lg rounded-full">
                                View Casuals
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                        <div className="w-1.5 h-3 bg-gold-500 rounded-full" />
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 p-10 bg-white rounded-[40px] shadow-2xl shadow-brand-100 border border-brand-50 -mt-24 relative z-20">
                    {[
                        { icon: Truck, title: 'Ethiopia Delivery', desc: 'Free delivery in Addis Ababa' },
                        { icon: ShieldCheck, title: 'Premium Quality', desc: '100% Genuine Fabrics' },
                        { icon: RotateCcw, title: 'Easy Returns', desc: '7-day hassle free exchange' },
                        { icon: Heart, title: 'Customer Choice', desc: 'Rated 4.9/5 by our sisters' },
                    ].map((badge, i) => (
                        <div key={i} className={`flex flex-col items-center text-center gap-4 ${i > 0 ? 'border-l border-brand-100' : ''}`}>
                            <div className="p-4 bg-brand-50 rounded-2xl text-brand-600"><badge.icon size={32} /></div>
                            <div>
                                <h4 className="font-bold text-brand-950">{badge.title}</h4>
                                <p className="text-xs text-brand-500 mt-1">{badge.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl mb-4 font-display font-semibold text-brand-950">Collections</h2>
                    <p className="text-brand-600 max-w-xl mx-auto">Explore our curated collections tailored for every style and occasion.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat, idx) => (
                        <CategoryCard
                            key={cat.id}
                            name={cat.name}
                            slug={cat.slug}
                            image={categoryImages[cat.slug] || categoryImages.casual}
                            count={cat._count?.products || 0}
                            index={idx}
                        />
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="bg-brand-50 py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                        <div>
                            <span className="text-gold-600 font-bold uppercase tracking-widest text-xs mb-3 block">Selected for you</span>
                            <h2 className="text-4xl md:text-5xl font-display font-semibold text-brand-950">New Arrivals</h2>
                        </div>
                        <Link href="/products" className="group flex items-center gap-2 font-bold text-brand-950 hover:text-brand-600 transition-colors">
                            View All Products <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {products.length > 0 ? (
                            products.map((product, idx) => (
                                <ProductCard key={product.id} product={product} index={idx} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-brand-200">
                                <p className="text-brand-500 italic">Our new arrivals are coming soon...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Brand Story */}
            <section className="container mx-auto px-4">
                <div className="bg-brand-950 rounded-[50px] overflow-hidden flex flex-col lg:flex-row items-stretch min-h-[500px]">
                    <div className="flex-1 p-12 lg:p-20 flex flex-col justify-center space-y-8">
                        <h2 className="text-4xl md:text-5xl font-display font-semibold text-white leading-tight">
                            The Art of <span className="text-gold-500">Modesty</span>, <br />
                            Crafted with Care.
                        </h2>
                        <div className="space-y-6 text-brand-200/90 text-lg leading-relaxed max-w-lg">
                            <p>Alora Abayas was born out of a desire to provide women with modest wear that doesn&apos;t compromise on style or quality.</p>
                            <p>Every piece in our collection is meticulously crafted using premium fabrics sourced carefully to ensure durability and comfort.</p>
                        </div>
                        <div>
                            <Link href="#" className="btn-secondary rounded-full py-4 px-10">Our Story</Link>
                        </div>
                    </div>
                    <div className="flex-1 relative min-h-[300px]">
                        <Image
                            src="https://images.unsplash.com/photo-1609357602329-59301bb58121?auto=format&fit=crop&q=80&w=1000"
                            alt="Brand Story"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="container mx-auto px-4 py-10">
                <div className="bg-gold-50 rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-md space-y-4 text-center md:text-left">
                        <h3 className="text-3xl font-display font-semibold text-brand-950">Join the Alora Tribe</h3>
                        <p className="text-brand-600">Subscribe for early access to new collections and exclusive offers.</p>
                    </div>
                    <form className="w-full max-w-md flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-grow px-6 py-4 rounded-xl border border-brand-200 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all"
                        />
                        <button type="submit" className="btn-primary py-4 px-8 rounded-xl whitespace-nowrap">Subscribe</button>
                    </form>
                </div>
            </section>
        </div>
    );
}
