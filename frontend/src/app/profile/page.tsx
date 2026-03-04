'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { usersApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const { dbUser, refreshProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: dbUser?.name || '',
            phone: dbUser?.phone || '',
        },
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            await usersApi.updateProfile(data);
            await refreshProfile();
            toast.success('Profile updated successfully!');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        }
        setIsLoading(false);
    };

    return (
        <div className="pt-28 pb-20 min-h-screen bg-brand-50/50">
            <div className="container mx-auto px-4 max-w-xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

                    {/* Profile Header */}
                    <div className="bg-white rounded-2xl border border-brand-100 p-8 text-center mb-8">
                        <div className="w-20 h-20 mx-auto bg-brand-100 rounded-full flex items-center justify-center mb-4">
                            <User size={36} className="text-brand-500" />
                        </div>
                        <h1 className="text-2xl font-display font-semibold text-brand-950">{dbUser?.name || 'User'}</h1>
                        <p className="text-sm text-brand-500 flex items-center justify-center gap-1 mt-1">
                            <Mail size={14} /> {dbUser?.email}
                        </p>
                        <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                            <CheckCircle2 size={14} /> Verified Account
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="bg-white rounded-2xl border border-brand-100 p-8">
                        <h2 className="text-xl font-display font-semibold text-brand-950 mb-6">Edit Profile</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-brand-900 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                                    <input
                                        {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                                        className="w-full pl-10 pr-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-900 mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                                    <input
                                        {...register('phone')}
                                        className="w-full pl-10 pr-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder="+251 9..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-900 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                                    <input
                                        type="email"
                                        value={dbUser?.email || ''}
                                        disabled
                                        className="w-full pl-10 pr-4 py-3 bg-brand-100 border border-brand-100 rounded-lg text-brand-500 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-brand-400 mt-1">Email is managed through your authentication provider.</p>
                            </div>

                            <button type="submit" disabled={isLoading} className="btn-primary w-full rounded-xl py-4 disabled:opacity-70">
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Changes</>}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
