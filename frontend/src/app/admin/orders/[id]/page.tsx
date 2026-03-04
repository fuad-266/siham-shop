'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Package, MapPin, CreditCard, Truck } from 'lucide-react';
import { adminOrdersApi } from '@/lib/api';
import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, OrderStatus } from '@/types';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
    PAYMENT_SUBMITTED: 'PAYMENT_VERIFIED',
    PAYMENT_VERIFIED: 'PROCESSING',
    PROCESSING: 'SHIPPED',
    SHIPPED: 'DELIVERED',
};

export default function AdminOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchOrder = async () => {
        try {
            const { data } = await adminOrdersApi.getById(id);
            setOrder(data);
        } catch {
            toast.error('Order not found');
            router.push('/admin/orders');
        }
        setIsLoading(false);
    };

    useEffect(() => { fetchOrder(); }, [id]);

    const advanceStatus = async () => {
        if (!order) return;
        const next = NEXT_STATUS[order.status];
        if (!next) return;
        setIsUpdating(true);
        try {
            await adminOrdersApi.updateStatus(id, { status: next });
            toast.success(`Order moved to ${ORDER_STATUS_LABELS[next]}`);
            await fetchOrder();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update');
        }
        setIsUpdating(false);
    };

    const verifyPayment = async () => {
        setIsUpdating(true);
        try {
            await adminOrdersApi.verifyPayment(id);
            toast.success('Payment verified!');
            await fetchOrder();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to verify');
        }
        setIsUpdating(false);
    };

    const rejectOrder = async () => {
        if (!confirm('Reject this order?')) return;
        setIsUpdating(true);
        try {
            await adminOrdersApi.updateStatus(id, { status: 'REJECTED' });
            toast.success('Order rejected');
            await fetchOrder();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed');
        }
        setIsUpdating(false);
    };

    if (isLoading || !order) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-600" size={32} /></div>;
    }

    const nextStatus = NEXT_STATUS[order.status];
    const canVerify = order.status === 'PAYMENT_SUBMITTED';
    const canReject = ['PENDING_PAYMENT', 'PAYMENT_SUBMITTED'].includes(order.status);

    return (
        <div className="space-y-6 max-w-5xl">
            <button onClick={() => router.push('/admin/orders')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <ArrowLeft size={16} /> Back to Orders
            </button>

            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-display font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</h1>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <span className={cn('px-4 py-2 rounded-full text-sm font-bold', ORDER_STATUS_COLORS[order.status])}>
                    {ORDER_STATUS_LABELS[order.status]}
                </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                {canVerify && (
                    <button onClick={verifyPayment} disabled={isUpdating} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors disabled:opacity-50">
                        <CheckCircle2 size={18} /> Verify Payment
                    </button>
                )}
                {nextStatus && !canVerify && (
                    <button onClick={advanceStatus} disabled={isUpdating} className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-medium transition-colors disabled:opacity-50">
                        {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Truck size={18} />}
                        Move to {ORDER_STATUS_LABELS[nextStatus]}
                    </button>
                )}
                {canReject && (
                    <button onClick={rejectOrder} disabled={isUpdating} className="flex items-center gap-2 px-6 py-3 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-medium transition-colors disabled:opacity-50">
                        <XCircle size={18} /> Reject
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Items */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Package size={20} /> Order Items</h3>
                    {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 py-3 border-b border-gray-50 last:border-0">
                            <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                                <Image src={item.product?.images?.[0]?.imageUrl || ''} alt="" fill className="object-cover" sizes="56px" />
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                                <p className="text-xs text-gray-500">{item.size} / {item.color} × {item.quantity}</p>
                            </div>
                            <span className="text-sm font-semibold">{formatPrice(item.priceAtPurchase * item.quantity)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between text-lg font-bold pt-4 border-t border-gray-100">
                        <span>Total</span><span>{formatPrice(order.totalAmount)}</span>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Customer & Shipping */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><MapPin size={20} /> Customer & Shipping</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-semibold text-gray-900">{order.user?.name} ({order.user?.email})</p>
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                            <p>📞 {order.shippingAddress.phone}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><CreditCard size={20} /> Payment</h3>
                        <p className="text-sm text-gray-600">Method: <strong>{order.paymentMethod === 'TELEBIRR' ? 'Telebirr' : 'Bank Transfer'}</strong></p>
                        {order.paymentScreenshotUrl && (
                            <div>
                                <p className="text-xs text-gray-500 mb-2">Payment Screenshot:</p>
                                <a href={order.paymentScreenshotUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 text-sm hover:underline">View Screenshot →</a>
                            </div>
                        )}
                        {order.notes && (
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500">Customer Notes</p>
                                <p className="text-sm text-gray-700 mt-1">{order.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
