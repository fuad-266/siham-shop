'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Loader2, Save, ArrowLeft, Upload, X, Trash2 } from 'lucide-react';
import { adminProductsApi, adminCategoriesApi, categoriesApi } from '@/lib/api';
import { Category } from '@/types';
import toast from 'react-hot-toast';

export default function AdminNewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<File[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        categoriesApi.list().then(({ data }) => setCategories(data)).catch(() => { });
    }, []);

    const onSubmit = async (formData: any) => {
        setIsSubmitting(true);
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                categoryId: formData.categoryId,
                sizes: formData.sizes?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
                colors: formData.colors?.split(',').map((s: string) => s.trim()).filter(Boolean) || [],
                material: formData.material || undefined,
                sku: formData.sku || undefined,
                featured: formData.featured || false,
                isActive: true,
            };

            const { data: product } = await adminProductsApi.create(payload);

            // Upload images
            for (const img of images) {
                await adminProductsApi.uploadImage(product.id, img);
            }

            toast.success('Product created successfully!');
            router.push('/admin/products');
        } catch (err: any) {
            const msg = err.response?.data?.message;
            toast.error(Array.isArray(msg) ? msg[0] : msg || 'Failed to create product');
        }
        setIsSubmitting(false);
    };

    const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages(prev => [...prev, ...files]);
    };

    return (
        <div className="max-w-3xl">
            <button onClick={() => router.push('/admin/products')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft size={16} /> Back to Products
            </button>

            <h1 className="text-2xl font-display font-semibold text-gray-900 mb-8">Add New Product</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                        <input {...register('name', { required: 'Name is required' })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Elegant Silk Abaya" />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{(errors.name as any).message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea {...register('description', { required: 'Description is required' })} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none" placeholder="Describe the product..." />
                        {errors.description && <p className="mt-1 text-xs text-red-500">{(errors.description as any).message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (ETB) *</label>
                            <input type="number" step="0.01" {...register('price', { required: 'Required', min: { value: 1, message: 'Min 1' } })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
                            {errors.price && <p className="mt-1 text-xs text-red-500">{(errors.price as any).message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                            <input type="number" {...register('stock', { required: 'Required', min: { value: 0, message: 'Min 0' } })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
                            {errors.stock && <p className="mt-1 text-xs text-red-500">{(errors.stock as any).message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <select {...register('categoryId', { required: 'Required' })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white">
                                <option value="">Select...</option>
                                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                            {errors.categoryId && <p className="mt-1 text-xs text-red-500">{(errors.categoryId as any).message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sizes (comma-separated)</label>
                            <input {...register('sizes')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="S, M, L, XL, XXL" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Colors (comma-separated)</label>
                            <input {...register('colors')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Black, Navy, Beige" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                            <input {...register('material')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Premium Crepe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                            <input {...register('sku')} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="ALR-001" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input type="checkbox" {...register('featured')} id="featured" className="w-4 h-4 text-brand-600 rounded" />
                        <label htmlFor="featured" className="text-sm text-gray-700">Mark as Featured Product</label>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
                    <div className="flex flex-wrap gap-4">
                        {images.map((img, i) => (
                            <div key={i} className="relative w-24 h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                                <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        <label className="w-24 h-28 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 transition-colors">
                            <Upload size={20} className="text-gray-400" />
                            <span className="text-[10px] text-gray-400 mt-1">Add</span>
                            <input type="file" accept="image/*" multiple onChange={addImages} className="hidden" />
                        </label>
                    </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full rounded-xl py-4 text-lg disabled:opacity-70">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Create Product</>}
                </button>
            </form>
        </div>
    );
}
