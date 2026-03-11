'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, ArrowLeft, Minus, Plus, ChevronRight, Star, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import { useCart } from '@/providers/cart-provider';
import { formatPrice, cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter();
    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await productsApi.getBySlug(slug);
                setProduct(data);
                if (data.sizes?.length) setSelectedSize(data.sizes[0]);
                if (data.colors?.length) setSelectedColor(data.colors[0]);
            } catch {
                toast.error('Product not found');
            }
            setIsLoading(false);
        };
        fetchProduct();
    }, [slug]);

    const handleAddToCart = () => {
        if (!product) return;
        if (!selectedSize) { toast.error('Please select a size'); return; }
        if (!selectedColor) { toast.error('Please select a color'); return; }
        addItem(product, quantity, selectedSize, selectedColor);
    };

    if (isLoading) {
        return (
            <div className="pt-24 md:pt-28 pb-20 min-h-screen bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 animate-pulse">
                        <div className="aspect-[3/4] bg-brand-100 rounded-3xl" />
                        <div className="space-y-6 py-6">
                            <div className="h-4 bg-brand-100 rounded-full w-24" />
                            <div className="h-8 bg-brand-100 rounded-full w-3/4" />
                            <div className="h-6 bg-brand-100 rounded-full w-32" />
                            <div className="h-20 bg-brand-100 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-display font-semibold text-brand-950">Product Not Found</h2>
                    <Link href="/products" className="btn-primary inline-flex">Back to Shop</Link>
                </div>
            </div>
        );
    }

    const images = product.images.length > 0 ? product.images : [{ imageUrl: 'https://via.placeholder.com/600x800?text=No+Image', id: '0', isPrimary: true, productId: '', storagePath: '', displayOrder: 0 }];

    return (
        <div className="pt-24 md:pt-28 pb-20 min-h-screen bg-white">
            <div className="container mx-auto px-4">

                {/* ── Mobile Header ── */}
                <div className="flex items-center justify-between mb-6 md:hidden">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                        <ArrowLeft size={20} className="text-brand-900" />
                    </button>
                    <h2 className="text-base font-display font-semibold text-brand-950">Detail Product</h2>
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center"
                    >
                        <Heart size={20} className={cn(isLiked ? 'fill-red-500 text-red-500' : 'text-brand-400')} />
                    </button>
                </div>

                {/* ── Desktop Breadcrumb ── */}
                <nav className="hidden md:flex items-center gap-2 text-sm text-brand-500 mb-8">
                    <Link href="/" className="hover:text-brand-900">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/products" className="hover:text-brand-900">Shop</Link>
                    <ChevronRight size={14} />
                    <Link href={`/products?category=${product.category.slug}`} className="hover:text-brand-900">{product.category.name}</Link>
                    <ChevronRight size={14} />
                    <span className="text-brand-900 font-medium">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

                    {/* ── Image Gallery ── */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-brand-50">
                            <Image
                                src={images[selectedImage]?.imageUrl}
                                alt={product.name}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            {product.featured && (
                                <span className="absolute top-5 left-5 bg-brand-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                                    Best Seller
                                </span>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                                {images.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImage(idx)}
                                        className={cn(
                                            'relative w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all',
                                            selectedImage === idx
                                                ? 'border-brand-600 ring-2 ring-brand-600/20 opacity-100'
                                                : 'border-transparent opacity-50 hover:opacity-80'
                                        )}
                                    >
                                        <Image src={img.imageUrl} alt={`${product.name} ${idx + 1}`} fill className="object-cover" sizes="80px" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* ── Product Info ── */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="py-2 md:py-4 space-y-6">

                        {/* Category + Name */}
                        <div>
                            {product.featured && (
                                <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2 block">Best Seller</span>
                            )}
                            <h1 className="text-2xl md:text-4xl font-display font-semibold text-brand-950 mb-3">{product.name}</h1>

                            {/* Price + Rating */}
                            <div className="flex items-center gap-4">
                                <p className="text-2xl md:text-3xl font-bold text-brand-900">{formatPrice(product.price)}</p>
                                <div className="flex items-center gap-1.5 bg-brand-50 px-3 py-1.5 rounded-full">
                                    <Star size={14} fill="currentColor" className="text-gold-500" />
                                    <span className="text-sm font-semibold text-brand-700">5.0</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm md:text-base text-brand-600 leading-relaxed line-clamp-3 md:line-clamp-none">{product.description}</p>

                        {/* ── Size Selection ── */}
                        {product.sizes.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-brand-900 mb-3">
                                    Size
                                </h4>
                                <div className="flex gap-2.5 flex-wrap">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                'w-12 h-12 rounded-full text-sm font-bold border-2 transition-all flex items-center justify-center',
                                                selectedSize === size
                                                    ? 'border-brand-600 bg-brand-600 text-white'
                                                    : 'border-brand-200 text-brand-700 hover:border-brand-400'
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Color Selection ── */}
                        {product.colors.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-brand-900 mb-3">
                                    Color: <span className="text-brand-500 font-normal">{selectedColor}</span>
                                </h4>
                                <div className="flex gap-2.5 flex-wrap">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={cn(
                                                'px-5 py-2.5 rounded-full text-sm font-medium border-2 transition-all',
                                                selectedColor === color
                                                    ? 'border-brand-600 bg-brand-50 text-brand-900'
                                                    : 'border-brand-100 text-brand-600 hover:border-brand-300'
                                            )}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Quantity Selector ── */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-brand-900">Buy Item :</span>
                            <div className="flex items-center gap-0 border border-brand-200 rounded-full overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-brand-50 transition-colors"
                                >
                                    <Minus size={16} className="text-brand-600" />
                                </button>
                                <span className="w-10 text-center font-bold text-brand-950 text-sm">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-brand-50 transition-colors"
                                >
                                    <Plus size={16} className="text-brand-600" />
                                </button>
                            </div>
                        </div>

                        {/* Stock Info */}
                        {product.stock > 0 && product.stock <= 10 && (
                            <p className="text-sm text-red-500 font-medium">
                                ⚡ Only {product.stock} left in stock — order soon!
                            </p>
                        )}

                        {/* ── Add to Cart Button ── */}
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="w-full bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 py-4 rounded-2xl flex items-center justify-center gap-2.5 font-semibold text-base shadow-lg shadow-brand-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {product.stock === 0 ? 'Out of Stock' : (
                                <><ShoppingBag size={20} /> Add to Cart</>
                            )}
                        </button>

                        {/* ── Trust badges ── */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-100">
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                                    <Truck size={18} className="text-brand-600" />
                                </div>
                                <span className="text-[11px] text-brand-600">Free Shipping</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                                    <RotateCcw size={18} className="text-brand-600" />
                                </div>
                                <span className="text-[11px] text-brand-600">7-Day Returns</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                                    <ShieldCheck size={18} className="text-brand-600" />
                                </div>
                                <span className="text-[11px] text-brand-600">Genuine Fabric</span>
                            </div>
                        </div>

                        {/* Material & SKU */}
                        {(product.material || product.sku) && (
                            <div className="text-xs text-brand-400 space-y-1 pt-4 border-t border-brand-50">
                                {product.material && <p>Material: {product.material}</p>}
                                {product.sku && <p>SKU: {product.sku}</p>}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
