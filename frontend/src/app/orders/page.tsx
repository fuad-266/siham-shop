'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Clock, Loader2 } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await ordersApi.list();
                setOrders(data.data || data || []);
            } catch {
                setOrders([]);
            }
            setIsLoading(false);
        };
        fetch();
    }, []);

    if (isLoading) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
            </div>
        );
    }

    return (
        <div className="pt-28 pb-20 min-h-screen bg-brand-50/50">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-4xl font-display font-semibold text-brand-950 mb-10">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-brand-200 space-y-4">
                        <Package className="mx-auto text-brand-300" size={48} />
                        <h3 className="text-xl font-semibold text-brand-900">No orders yet</h3>
                        <p className="text-brand-500">Start shopping to see your orders here.</p>
                        <Link href="/products" className="btn-primary inline-flex rounded-full mt-4">Browse Products</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, idx) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link
                                    href={`/orders/${order.id}`}
                                    className="block bg-white rounded-2xl border border-brand-100 p-6 hover:shadow-lg hover:border-brand-200 transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-xs text-brand-400 font-mono">#{order.id.slice(0, 8)}</p>
                                            <p className="text-sm text-brand-500 mt-1 flex items-center gap-1">
                                                <Clock size={14} /> {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <span className={cn('px-3 py-1 rounded-full text-xs font-bold', ORDER_STATUS_COLORS[order.status])}>
                                            {ORDER_STATUS_LABELS[order.status]}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-brand-600">{order.items?.length || 0} items</span>
                                            <span className="text-brand-300">·</span>
                                            <span className="text-sm text-brand-600">{order.paymentMethod === 'TELEBIRR' ? 'Telebirr' : 'Bank Transfer'}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-bold text-brand-900">{formatPrice(order.totalAmount)}</span>
                                            <ChevronRight size={18} className="text-brand-400 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
