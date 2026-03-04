'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Loader2, ArrowRight, User as UserIcon, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get('next') || '/';
    const supabase = createClient();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                        phone: data.phone,
                        role: 'CUSTOMER', // Default role
                    },
                },
            });

            if (error) throw error;

            toast.success('Registration successful! Please sign in.');
            router.push(`/auth/login?next=${next}`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-brand-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg w-full"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-brand-100">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-display font-semibold text-brand-950 mb-2">Create Account</h1>
                        <p className="text-brand-600">Join Alora Abayas for an exclusive shopping experience</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-brand-900 mb-2">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                                    <input
                                        type="text"
                                        {...register('name', { required: 'Name is required' })}
                                        className="w-full pl-10 pr-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-xs text-red-500">{(errors.name as any).message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-900 mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                                    <input
                                        type="tel"
                                        {...register('phone', { required: 'Phone is required' })}
                                        className="w-full pl-10 pr-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                                        placeholder="+251 9..."
                                    />
                                </div>
                                {errors.phone && <p className="mt-1 text-xs text-red-500">{(errors.phone as any).message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-brand-900 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: 'Invalid email address',
                                        }
                                    })}
                                    className="w-full pl-10 pr-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                                    placeholder="name@example.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-500">{(errors.email as any).message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-brand-900 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                                    <input
                                        type="password"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: { value: 6, message: 'Minimum 6 characters' }
                                        })}
                                        className="w-full pl-10 pr-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="mt-1 text-xs text-red-500">{(errors.password as any).message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brand-900 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                                    <input
                                        type="password"
                                        {...register('confirmPassword', {
                                            required: 'Please confirm your password',
                                            validate: (val: string) => val === password || 'Passwords do not match'
                                        })}
                                        className="w-full pl-10 pr-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{(errors.confirmPassword as any).message}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary disabled:opacity-70 disabled:scale-100 mt-4"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-sm text-brand-600">
                        Already have an account?{' '}
                        <Link href={`/auth/login?next=${next}`} className="text-brand-800 font-semibold hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
