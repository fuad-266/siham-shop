'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, Loader2, ArrowRight, Clock, Eye } from 'lucide-react';
import { analyticsApi } from '@/lib/api';
import { DashboardMetrics, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types';
import { formatPrice, formatRelativeTime, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await analyticsApi.dashboard();
                setMetrics(data);
            } catch (err) {
                console.error('Failed to load metrics:', err);
            }
            setIsLoading(false);
        };
        fetch();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin text-brand-600" size={32} />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Revenue', value: formatPrice(metrics?.revenue || 0), icon: DollarSign, color: 'bg-emerald-500', change: '+12%' },
        { label: 'Total Orders', value: String(metrics?.totalOrders || 0), icon: ShoppingCart, color: 'bg-blue-500', change: '+8%' },
        { label: 'Pending Orders', value: String(metrics?.pendingOrders || 0), icon: Clock, color: 'bg-amber-500', change: '' },
        { label: 'Active Products', value: String(metrics?.totalProducts || 0), icon: Package, color: 'bg-purple-500', change: '' },
        { label: 'Customers', value: String(metrics?.totalUsers || 0), icon: Users, color: 'bg-pink-500', change: '+5%' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-display font-semibold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of your store performance</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn('p-3 rounded-xl text-white', stat.color)}>
                                <stat.icon size={22} />
                            </div>
                            {stat.change && (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-0.5">
                                    <TrendingUp size={12} /> {stat.change}
                                </span>
                            )}
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Status Breakdown */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Orders by Status</h3>
                    <div className="space-y-3">
                        {(metrics?.ordersByStatus || []).map((s) => {
                            const total = metrics?.totalOrders || 1;
                            const pct = Math.round((s.count / total) * 100);
                            return (
                                <div key={s.status}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold', ORDER_STATUS_COLORS[s.status])}>
                                            {ORDER_STATUS_LABELS[s.status]}
                                        </span>
                                        <span className="text-gray-600 font-medium">{s.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                        <Link href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1">
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="pb-3">Order</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Time</th>
                                    <th className="pb-3"></th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {(metrics?.recentOrders || []).map((order) => (
                                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-3 font-mono text-xs text-gray-600">#{order.id.slice(0, 8)}</td>
                                        <td className="py-3 font-medium text-gray-900">{order.user?.name || 'N/A'}</td>
                                        <td className="py-3">
                                            <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold', ORDER_STATUS_COLORS[order.status])}>
                                                {ORDER_STATUS_LABELS[order.status]}
                                            </span>
                                        </td>
                                        <td className="py-3 font-semibold text-gray-900">{formatPrice(order.totalAmount)}</td>
                                        <td className="py-3 text-gray-500 text-xs">{formatRelativeTime(order.createdAt)}</td>
                                        <td className="py-3">
                                            <Link href={`/admin/orders/${order.id}`} className="text-brand-600 hover:text-brand-800">
                                                <Eye size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
