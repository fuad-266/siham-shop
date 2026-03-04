'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Loader2, ArrowRight, Github, Chrome } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get('next') || '/';
    const supabase = createClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) throw error;

            toast.success('Welcome back!');
            router.push(next);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign in');
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
            });
            if (error) throw error;
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign in with Google');
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-brand-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-brand-100">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-display font-semibold text-brand-950 mb-2">Welcome Back</h1>
                        <p className="text-brand-600">Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-900 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="w-full pl-10 pr-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                                    placeholder="name@example.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-500">{(errors.email as any).message}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-brand-900">Password</label>
                                <Link href="#" className="text-xs text-brand-600 hover:text-brand-900 font-medium">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                                <input
                                    type="password"
                                    {...register('password', { required: 'Password is required' })}
                                    className="w-full pl-10 pr-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-500">{(errors.password as any).message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary disabled:opacity-70 disabled:scale-100"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
                            {!isLoading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-100"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-brand-400">Or continue with</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={signInWithGoogle}
                                className="flex items-center justify-center gap-2 py-3 px-4 border border-brand-100 rounded-lg hover:bg-brand-50 transition-colors text-sm font-medium"
                            >
                                <Chrome size={18} className="text-red-500" /> Google
                            </button>
                            <button
                                className="flex items-center justify-center gap-2 py-3 px-4 border border-brand-100 rounded-lg hover:bg-brand-50 transition-colors text-sm font-medium"
                            >
                                <Github size={18} /> GitHub
                            </button>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-sm text-brand-600">
                        Don't have an account?{' '}
                        <Link href={`/auth/register?next=${next}`} className="text-brand-800 font-semibold hover:underline">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
