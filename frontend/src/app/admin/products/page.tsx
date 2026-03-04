'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Loader2, Pencil, Trash2, Eye, Search, Package } from 'lucide-react';
import { adminProductsApi } from '@/lib/api';
import { Product } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            const { data } = await adminProductsApi.listAll({ limit: 100 });
            setProducts(data.data || data || []);
        } catch { setProducts([]); }
        setIsLoading(false);
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
        setDeletingId(id);
        try {
            await adminProductsApi.delete(id);
            toast.success('Product deleted');
            await fetchProducts();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        }
        setDeletingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-display font-semibold text-gray-900">Products</h1>
                <Link href="/admin/products/new" className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-medium transition-colors text-sm">
                    <Plus size={18} /> Add Product
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600" size={28} /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                                                    <Image src={product.images[0]?.imageUrl || ''} alt="" fill className="object-cover" sizes="40px" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-gray-400">{product.sku || 'No SKU'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{product.category.name}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(product.price)}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn('text-sm font-bold', product.stock <= 5 ? 'text-red-600' : 'text-gray-700')}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold', product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Link href={`/products/${product.slug}`} className="p-2 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <Eye size={16} />
                                                </Link>
                                                <Link href={`/admin/products/${product.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <Pencil size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    disabled={deletingId === product.id}
                                                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                                                >
                                                    {deletingId === product.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr><td colSpan={6} className="px-6 py-16 text-center text-gray-400">No products yet. Add your first product.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
