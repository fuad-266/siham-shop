'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, Package, MapPin, CreditCard, Truck, Clock, Upload, XCircle } from 'lucide-react';
import { ordersApi, uploadApi } from '@/lib/api';
import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, OrderStatus } from '@/types';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const statusSteps: OrderStatus[] = ['PENDING_PAYMENT', 'PAYMENT_SUBMITTED', 'PAYMENT_VERIFIED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await ordersApi.getById(id);
                setOrder(data);
            } catch {
                toast.error('Order not found');
                router.push('/orders');
            }
            setIsLoading(false);
        };
        fetch();
    }, [id]);

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this order?')) return;
        setIsCancelling(true);
        try {
            await ordersApi.cancel(id);
            toast.success('Order cancelled');
            router.refresh();
            const { data } = await ordersApi.getById(id);
            setOrder(data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to cancel');
        }
        setIsCancelling(false);
    };

    if (isLoading || !order) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
            </div>
        );
    }

    const currentStepIndex = statusSteps.indexOf(order.status);
    const isCancelled = order.status === 'CANCELLED' || order.status === 'REJECTED';
    const canCancel = ['PENDING_PAYMENT', 'PAYMENT_SUBMITTED'].includes(order.status);

    return (
        <div className="pt-28 pb-20 min-h-screen bg-brand-50/50">
            <div className="container mx-auto px-4 max-w-4xl">
                <button onClick={() => router.push('/orders')} className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-900 mb-8">
                    <ArrowLeft size={16} /> Back to Orders
                </button>

                <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-semibold text-brand-950">Order Details</h1>
                        <p className="text-sm text-brand-500 font-mono mt-1">#{order.id.slice(0, 8)}</p>
                    </div>
                    <span className={cn('px-4 py-2 rounded-full text-sm font-bold', ORDER_STATUS_COLORS[order.status])}>
                        {ORDER_STATUS_LABELS[order.status]}
                    </span>
                </div>

                {/* Order Timeline */}
                {!isCancelled && (
                    <div className="bg-white rounded-2xl border border-brand-100 p-6 md:p-8 mb-8">
                        <h3 className="text-lg font-semibold text-brand-950 mb-6">Order Progress</h3>
                        <div className="flex items-center justify-between overflow-x-auto pb-2">
                            {statusSteps.map((s, i) => (
                                <div key={s} className="flex items-center">
                                    <div className={cn(
                                        'w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                                        i <= currentStepIndex ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-400'
                                    )}>
                                        {i + 1}
                                    </div>
                                    {i < statusSteps.length - 1 && (
                                        <div className={cn('w-8 md:w-16 h-1 mx-1', i < currentStepIndex ? 'bg-brand-600' : 'bg-brand-100')} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] text-brand-500 uppercase tracking-wider overflow-x-auto">
                            {statusSteps.map((s) => (<span key={s} className="text-center min-w-[60px]">{ORDER_STATUS_LABELS[s].split(' ').pop()}</span>))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Items */}
                    <div className="bg-white rounded-2xl border border-brand-100 p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-brand-950 flex items-center gap-2"><Package size={20} /> Items</h3>
                        {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4 py-3 border-b border-brand-50 last:border-0">
                                <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-brand-50 shrink-0">
                                    <Image src={item.product?.images?.[0]?.imageUrl || ''} alt={item.product?.name || 'Product'} fill className="object-cover" sizes="64px" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-semibold text-brand-900">{item.product?.name || 'Product'}</p>
                                    <p className="text-xs text-brand-500">{item.size} / {item.color} × {item.quantity}</p>
                                </div>
                                <span className="text-sm font-bold text-brand-900 shrink-0">{formatPrice(item.priceAtPurchase * item.quantity)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between pt-4 text-lg font-bold text-brand-950">
                            <span>Total</span>
                            <span>{formatPrice(order.totalAmount)}</span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Shipping */}
                        <div className="bg-white rounded-2xl border border-brand-100 p-6 space-y-3">
                            <h3 className="text-lg font-semibold text-brand-950 flex items-center gap-2"><MapPin size={20} /> Shipping</h3>
                            <div className="text-sm text-brand-600 space-y-1">
                                <p className="font-semibold text-brand-900">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                                <p>📞 {order.shippingAddress.phone}</p>
                            </div>
                            {order.trackingNumber && (
                                <div className="bg-brand-50 rounded-lg p-3">
                                    <p className="text-xs text-brand-500">Tracking Number</p>
                                    <p className="text-sm font-mono font-bold text-brand-900">{order.trackingNumber}</p>
                                </div>
                            )}
                        </div>

                        {/* Payment */}
                        <div className="bg-white rounded-2xl border border-brand-100 p-6 space-y-3">
                            <h3 className="text-lg font-semibold text-brand-950 flex items-center gap-2"><CreditCard size={20} /> Payment</h3>
                            <p className="text-sm text-brand-600">Method: <strong>{order.paymentMethod === 'TELEBIRR' ? 'Telebirr' : 'Bank Transfer'}</strong></p>
                            <p className="text-sm text-brand-600 flex items-center gap-1"><Clock size={14} /> Placed: {formatDate(order.createdAt)}</p>
                        </div>

                        {/* Cancel Button */}
                        {canCancel && (
                            <button
                                onClick={handleCancel}
                                disabled={isCancelling}
                                className="w-full flex items-center justify-center gap-2 py-3 px-6 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-medium transition-colors disabled:opacity-50"
                            >
                                {isCancelling ? <Loader2 className="animate-spin" size={18} /> : <><XCircle size={18} /> Cancel Order</>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
