'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Loader2, ArrowRight, Upload, CheckCircle2, CreditCard, Phone, Building, MapPin, User as UserIcon, FileText } from 'lucide-react';
import { useCart } from '@/providers/cart-provider';
import { useAuth } from '@/providers/auth-provider';
import { ordersApi, uploadApi } from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';
import { PaymentMethod } from '@/types';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type CheckoutStep = 'shipping' | 'payment' | 'review';

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const { user, dbUser } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState<CheckoutStep>('shipping');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TELEBIRR');
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId, setOrderId] = useState('');

    const { register, handleSubmit, formState: { errors }, getValues } = useForm({
        defaultValues: {
            fullName: dbUser?.name || '',
            phone: dbUser?.phone || '',
            street: '',
            city: 'Addis Ababa',
            postalCode: '',
            country: 'Ethiopia',
            notes: '',
        },
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Only JPEG, PNG, or WebP images are allowed');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be under 5MB');
            return;
        }
        setPaymentScreenshot(file);
        setScreenshotPreview(URL.createObjectURL(file));
    };

    const onSubmitOrder = async () => {
        setIsSubmitting(true);
        try {
            let screenshotUrl = '';

            // Upload payment screenshot if provided
            if (paymentScreenshot) {
                const { data } = await uploadApi.paymentScreenshot(paymentScreenshot);
                screenshotUrl = data.url;
            }

            const shippingData = getValues();

            const orderPayload = {
                items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                })),
                paymentMethod,
                ...(screenshotUrl && { paymentScreenshotUrl: screenshotUrl }),
                ...(shippingData.notes && { notes: shippingData.notes }),
                shippingAddress: {
                    fullName: shippingData.fullName,
                    phone: shippingData.phone,
                    street: shippingData.street,
                    city: shippingData.city,
                    postalCode: shippingData.postalCode || undefined,
                    country: shippingData.country,
                },
            };

            const { data: order } = await ordersApi.create(orderPayload);
            setOrderId(order.id);
            clearCart();
            setStep('review');
            toast.success('Order placed successfully!');
        } catch (error: any) {
            const msg = error.response?.data?.message;
            toast.error(Array.isArray(msg) ? msg[0] : msg || 'Failed to place order');
        }
        setIsSubmitting(false);
    };

    // Order confirmation view
    if (step === 'review' && orderId) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-brand-50/50 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6 border border-brand-100"
                >
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={48} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-display font-semibold text-brand-950">Order Confirmed!</h1>
                    <p className="text-brand-600">
                        Thank you for your order. We&apos;ll review your payment and update your order status.
                    </p>
                    <div className="bg-brand-50 rounded-2xl p-6 text-left space-y-2">
                        <p className="text-xs text-brand-400 uppercase tracking-widest font-bold">Order ID</p>
                        <p className="text-sm font-mono text-brand-900 break-all">{orderId}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => router.push(`/orders/${orderId}`)} className="btn-primary rounded-xl py-4">
                            View Order Details
                        </button>
                        <button onClick={() => router.push('/products')} className="btn-secondary rounded-xl py-4">
                            Continue Shopping
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0 && !orderId) {
        router.push('/cart');
        return null;
    }

    const steps: { key: CheckoutStep; label: string; icon: any }[] = [
        { key: 'shipping', label: 'Shipping', icon: MapPin },
        { key: 'payment', label: 'Payment', icon: CreditCard },
        { key: 'review', label: 'Review', icon: FileText },
    ];

    return (
        <div className="pt-28 pb-20 min-h-screen bg-brand-50/50">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-display font-semibold text-brand-950 mb-8 text-center">Checkout</h1>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-0 mb-12">
                    {steps.map((s, i) => (
                        <React.Fragment key={s.key}>
                            <div className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                                step === s.key ? 'bg-brand-600 text-white' : 'bg-white text-brand-400 border border-brand-100'
                            )}>
                                <s.icon size={16} /> {s.label}
                            </div>
                            {i < steps.length - 1 && <div className="w-12 h-px bg-brand-200 mx-2" />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Form Area */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {step === 'shipping' && (
                                <motion.div key="shipping" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white rounded-2xl border border-brand-100 p-6 md:p-8 space-y-6">
                                    <h2 className="text-xl font-display font-semibold text-brand-950">Shipping Address</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-brand-900 mb-2">Full Name *</label>
                                            <input {...register('fullName', { required: 'Required' })} className="w-full px-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                                            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-brand-900 mb-2">Phone *</label>
                                            <input {...register('phone', { required: 'Required' })} className="w-full px-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="+251 9..." />
                                            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-brand-900 mb-2">Street Address *</label>
                                        <input {...register('street', { required: 'Required' })} className="w-full px-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                                        {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street.message}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-brand-900 mb-2">City *</label>
                                            <input {...register('city', { required: 'Required' })} className="w-full px-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-brand-900 mb-2">Postal Code</label>
                                            <input {...register('postalCode')} className="w-full px-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-brand-900 mb-2">Country</label>
                                            <input {...register('country')} disabled className="w-full px-4 py-3 bg-brand-100 border border-brand-100 rounded-lg text-brand-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-brand-900 mb-2">Order Notes (optional)</label>
                                        <textarea {...register('notes')} rows={3} className="w-full px-4 py-3 bg-brand-50 border border-brand-100 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none resize-none" placeholder="Any special instructions..." />
                                    </div>
                                    <button onClick={handleSubmit(() => setStep('payment'))} className="btn-primary w-full rounded-xl py-4">
                                        Continue to Payment <ArrowRight size={18} />
                                    </button>
                                </motion.div>
                            )}

                            {step === 'payment' && (
                                <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white rounded-2xl border border-brand-100 p-6 md:p-8 space-y-6">
                                    <h2 className="text-xl font-display font-semibold text-brand-950">Payment Method</h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setPaymentMethod('TELEBIRR')}
                                            className={cn(
                                                'p-6 rounded-xl border-2 text-center transition-all',
                                                paymentMethod === 'TELEBIRR' ? 'border-brand-600 bg-brand-50' : 'border-brand-100 hover:border-brand-300'
                                            )}
                                        >
                                            <Phone className="mx-auto mb-3 text-brand-600" size={32} />
                                            <p className="font-semibold text-brand-950">Telebirr</p>
                                            <p className="text-xs text-brand-500 mt-1">Mobile Payment</p>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('BANK_TRANSFER')}
                                            className={cn(
                                                'p-6 rounded-xl border-2 text-center transition-all',
                                                paymentMethod === 'BANK_TRANSFER' ? 'border-brand-600 bg-brand-50' : 'border-brand-100 hover:border-brand-300'
                                            )}
                                        >
                                            <Building className="mx-auto mb-3 text-brand-600" size={32} />
                                            <p className="font-semibold text-brand-950">Bank Transfer</p>
                                            <p className="text-xs text-brand-500 mt-1">Direct Bank</p>
                                        </button>
                                    </div>

                                    {/* Payment Instructions */}
                                    <div className="bg-gold-50 rounded-xl p-6 space-y-3">
                                        <h4 className="font-semibold text-brand-950">Payment Instructions</h4>
                                        {paymentMethod === 'TELEBIRR' ? (
                                            <div className="text-sm text-brand-700 space-y-2">
                                                <p>1. Open your Telebirr app</p>
                                                <p>2. Send <strong>{formatPrice(totalPrice)}</strong> to: <strong>+251 911 234 567</strong></p>
                                                <p>3. Take a screenshot of the confirmation</p>
                                                <p>4. Upload the screenshot below</p>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-brand-700 space-y-2">
                                                <p>1. Transfer <strong>{formatPrice(totalPrice)}</strong> to:</p>
                                                <p className="font-mono bg-white p-3 rounded-lg">Commercial Bank of Ethiopia<br />Acc: 1000-XXXX-XXXX-XXXX<br />Name: Alora Abayas PLC</p>
                                                <p>2. Take a screenshot of the transfer receipt</p>
                                                <p>3. Upload the screenshot below</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Screenshot Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-brand-900 mb-3">Upload Payment Screenshot (optional now, can submit later)</label>
                                        <label className="relative block border-2 border-dashed border-brand-200 rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 transition-colors">
                                            {screenshotPreview ? (
                                                <div className="relative w-40 h-40 mx-auto rounded-lg overflow-hidden">
                                                    <Image src={screenshotPreview} alt="Payment screenshot" fill className="object-contain" />
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Upload className="mx-auto text-brand-400" size={32} />
                                                    <p className="text-sm text-brand-500">Click to upload or drag & drop</p>
                                                    <p className="text-xs text-brand-400">JPEG, PNG, WebP — Max 5MB</p>
                                                </div>
                                            )}
                                            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} className="hidden" />
                                        </label>
                                    </div>

                                    <div className="flex gap-4">
                                        <button onClick={() => setStep('shipping')} className="btn-secondary flex-1 rounded-xl py-4">Back</button>
                                        <button onClick={onSubmitOrder} disabled={isSubmitting} className="btn-primary flex-1 rounded-xl py-4 disabled:opacity-70">
                                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Place Order <ArrowRight size={18} /></>}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-brand-100 p-6 sticky top-28 space-y-6">
                            <h3 className="text-lg font-display font-semibold text-brand-950">Order Summary</h3>
                            <div className="space-y-4 max-h-60 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                                        <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-brand-50 shrink-0">
                                            <Image src={item.product.images[0]?.imageUrl || ''} alt={item.product.name} fill className="object-cover" sizes="56px" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="text-sm font-medium text-brand-900 line-clamp-1">{item.product.name}</p>
                                            <p className="text-xs text-brand-500">{item.size} / {item.color} × {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-brand-900 shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <hr className="border-brand-100" />
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-brand-600"><span>Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
                                <div className="flex justify-between text-brand-600"><span>Shipping</span><span className="text-green-600 font-semibold">Free</span></div>
                                <hr className="border-brand-100" />
                                <div className="flex justify-between text-lg font-bold text-brand-950"><span>Total</span><span>{formatPrice(totalPrice)}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
