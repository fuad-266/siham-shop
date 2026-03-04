'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { categoriesApi, adminCategoriesApi } from '@/lib/api';
import { Category } from '@/types';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCategories = async () => {
        try {
            const { data } = await categoriesApi.list();
            setCategories(data);
        } catch { setCategories([]); }
        setIsLoading(false);
    };

    useEffect(() => { fetchCategories(); }, []);

    const resetForm = () => { setFormData({ name: '', description: '' }); setEditingId(null); setShowForm(false); };

    const handleSave = async () => {
        if (!formData.name.trim()) { toast.error('Name is required'); return; }
        setIsSubmitting(true);
        try {
            if (editingId) {
                await adminCategoriesApi.update(editingId, formData);
                toast.success('Category updated');
            } else {
                await adminCategoriesApi.create(formData);
                toast.success('Category created');
            }
            resetForm();
            await fetchCategories();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed');
        }
        setIsSubmitting(false);
    };

    const handleEdit = (cat: Category) => {
        setFormData({ name: cat.name, description: cat.description || '' });
        setEditingId(cat.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"?`)) return;
        try {
            await adminCategoriesApi.delete(id);
            toast.success('Category deleted');
            await fetchCategories();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Cannot delete — products may be linked');
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-display font-semibold text-gray-900">Categories</h1>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-medium transition-colors text-sm">
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {/* Inline Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Category' : 'New Category'}</h3>
                    <input
                        value={formData.name}
                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                        placeholder="Category name"
                    />
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                        rows={2}
                        placeholder="Description (optional)"
                    />
                    <div className="flex gap-3">
                        <button onClick={handleSave} disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-medium text-sm disabled:opacity-50">
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
                        </button>
                        <button onClick={resetForm} className="px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm">Cancel</button>
                    </div>
                </div>
            )}

            {/* Categories List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-600" size={28} /></div>
                ) : categories.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">No categories yet.</div>
                ) : (
                    <div>
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex items-center justify-between px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="font-medium text-gray-900">{cat.name}</p>
                                    <p className="text-xs text-gray-500">{cat.slug} · {cat._count?.products || 0} products</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => handleEdit(cat)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"><Pencil size={16} /></button>
                                    <button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
