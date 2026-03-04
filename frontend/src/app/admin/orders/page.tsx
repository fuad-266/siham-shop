'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Loader2, Clock, Filter } from 'lucide-react';
import { adminOrdersApi } from '@/lib/api';
import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, OrderStatus } from '@/types';
import { formatPrice, formatRelativeTime, cn } from '@/lib/utils';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            try {
                const params: any = { limit: 50 };
                if (statusFilter) params.status = statusFilter;
                const { data } = await adminOrdersApi.list(params);
                setOrders(data.data || data || []);
            } catch { setOrders([]); }
            setIsLoading(false);
        };
        fetch();
    }, [statusFilter]);

    const statuses: OrderStatus[] = ['PENDING_PAYMENT', 'PAYMENT_SUBMITTED', 'PAYMENT_VERIFIED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'REJECTED', 'CANCELLED'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-display font-semibold text-gray-900">Order Management</h1>
                <span className="text-sm text-gray-500">{orders.length} orders</span>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                <button onClick={() => setStatusFilter('')} className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-colors', !statusFilter ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}>All</button>
                {statuses.map((s) => (
                    <button key={s} onClick={() => setStatusFilter(s)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-colors', statusFilter === s ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}>
                        {ORDER_STATUS_LABELS[s]}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600" size={28} /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-600">#{order.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{order.user?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold', ORDER_STATUS_COLORS[order.status])}>
                                                {ORDER_STATUS_LABELS[order.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{order.paymentMethod === 'TELEBIRR' ? 'Telebirr' : 'Bank'}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(order.totalAmount)}</td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">{formatRelativeTime(order.createdAt)}</td>
                                        <td className="px-6 py-4">
                                            <Link href={`/admin/orders/${order.id}`} className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors inline-flex">
                                                <Eye size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr><td colSpan={7} className="px-6 py-16 text-center text-gray-400">No orders found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
