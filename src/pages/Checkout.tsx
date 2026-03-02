import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../hooks/useCart';
import { CustomerInfo, Order } from '../types/models';
import './Checkout.css';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

interface PaymentData {
    method: 'bank_transfer' | 'telebirr';
    screenshot: File | null;
    screenshotPreview: string | null;
}

const Checkout = () => {
    const navigate = useNavigate();
    const { items, subtotal, shippingCost, total, clearCart } = useCart();
    const [step, setStep] = useState<CheckoutStep>('shipping');
    const [paymentData, setPaymentData] = useState<PaymentData>({
        method: 'telebirr',
        screenshot: null,
        screenshotPreview: null,
    });
    const [order, setOrder] = useState<Order | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<CustomerInfo>({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            address: { street: '', city: '', postalCode: '', country: 'Ethiopia' },
        },
    });

    // Redirect if cart is empty and not on confirmation
    if (items.length === 0 && step !== 'confirmation') {
        return (
            <div className="checkout checkout--empty">
                <h2>Your cart is empty</h2>
                <p>Add some items before checking out.</p>
                <button onClick={() => navigate('/')} className="checkout__browse-btn">Browse Abayas</button>
            </div>
        );
    }

    const handleShippingSubmit = () => {
        handleSubmit(() => {
            setStep('payment');
        })();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowed.includes(file.type)) {
            alert('Please upload a JPG, PNG, or PDF file.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File must be smaller than 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setPaymentData((prev) => ({
                ...prev,
                screenshot: file,
                screenshotPreview: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handlePlaceOrder = () => {
        if (!paymentData.screenshot) {
            alert('Please upload your payment screenshot.');
            return;
        }

        const customerInfo = getValues();
        const newOrder: Order = {
            orderId: crypto.randomUUID(),
            orderDate: new Date(),
            status: 'pending',
            customer: customerInfo,
            items: [...items],
            subtotal,
            shippingCost,
            total,
            paymentMethod: paymentData.method,
            paymentScreenshot: paymentData.screenshotPreview || '',
        };

        setOrder(newOrder);
        clearCart();
        setStep('confirmation');

        // Save order to localStorage
        try {
            const orders = JSON.parse(localStorage.getItem('alora-orders') || '[]');
            orders.push(newOrder);
            localStorage.setItem('alora-orders', JSON.stringify(orders));
        } catch (err) {
            console.warn('Failed to save order:', err);
        }
    };

    return (
        <div className="checkout">
            <button onClick={() => navigate(step === 'shipping' ? '/cart' : '')} className="checkout__back-btn">
                &larr; {step === 'shipping' ? 'Back to Cart' : 'Back'}
            </button>

            {/* Step Indicator */}
            <div className="checkout__steps">
                {['shipping', 'payment', 'confirmation'].map((s, i) => (
                    <div
                        key={s}
                        className={`checkout__step ${step === s ? 'checkout__step--active' : ''} ${['shipping', 'payment', 'confirmation'].indexOf(step) > i ? 'checkout__step--done' : ''
                            }`}
                    >
                        <span className="checkout__step-num">{i + 1}</span>
                        <span className="checkout__step-label">{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                    </div>
                ))}
            </div>

            <div className="checkout__layout">
                {/* Main Content */}
                <div className="checkout__main">
                    {/* ---- SHIPPING STEP ---- */}
                    {step === 'shipping' && (
                        <div className="checkout__section">
                            <h2 className="checkout__section-title">Shipping Information</h2>
                            <form onSubmit={(e) => { e.preventDefault(); handleShippingSubmit(); }}>
                                <div className="checkout__field">
                                    <label htmlFor="fullName">Full Name *</label>
                                    <input
                                        id="fullName"
                                        {...register('fullName', { required: 'Full name is required' })}
                                        className={errors.fullName ? 'checkout__input--error' : ''}
                                    />
                                    {errors.fullName && <span className="checkout__error">{errors.fullName.message}</span>}
                                </div>

                                <div className="checkout__row">
                                    <div className="checkout__field">
                                        <label htmlFor="email">Email *</label>
                                        <input
                                            id="email"
                                            type="email"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                                            })}
                                            className={errors.email ? 'checkout__input--error' : ''}
                                        />
                                        {errors.email && <span className="checkout__error">{errors.email.message}</span>}
                                    </div>
                                    <div className="checkout__field">
                                        <label htmlFor="phone">Phone *</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            {...register('phone', { required: 'Phone is required' })}
                                            className={errors.phone ? 'checkout__input--error' : ''}
                                        />
                                        {errors.phone && <span className="checkout__error">{errors.phone.message}</span>}
                                    </div>
                                </div>

                                <div className="checkout__field">
                                    <label htmlFor="street">Street Address *</label>
                                    <input
                                        id="street"
                                        {...register('address.street', { required: 'Street is required' })}
                                        className={errors.address?.street ? 'checkout__input--error' : ''}
                                    />
                                    {errors.address?.street && <span className="checkout__error">{errors.address.street.message}</span>}
                                </div>

                                <div className="checkout__row">
                                    <div className="checkout__field">
                                        <label htmlFor="city">City *</label>
                                        <input
                                            id="city"
                                            {...register('address.city', { required: 'City is required' })}
                                            className={errors.address?.city ? 'checkout__input--error' : ''}
                                        />
                                        {errors.address?.city && <span className="checkout__error">{errors.address.city.message}</span>}
                                    </div>
                                    <div className="checkout__field">
                                        <label htmlFor="postalCode">Postal Code</label>
                                        <input id="postalCode" {...register('address.postalCode')} />
                                    </div>
                                    <div className="checkout__field">
                                        <label htmlFor="country">Country</label>
                                        <input id="country" {...register('address.country')} />
                                    </div>
                                </div>

                                <button type="submit" className="checkout__next-btn">
                                    Continue to Payment →
                                </button>
                            </form>
                        </div>
                    )}

                    {/* ---- PAYMENT STEP ---- */}
                    {step === 'payment' && (
                        <div className="checkout__section">
                            <h2 className="checkout__section-title">Payment</h2>

                            {/* Payment Method Selection */}
                            <div className="checkout__payment-methods">
                                <button
                                    className={`checkout__payment-option ${paymentData.method === 'telebirr' ? 'checkout__payment-option--active' : ''}`}
                                    onClick={() => setPaymentData((p) => ({ ...p, method: 'telebirr' }))}
                                >
                                    <strong>Telebirr</strong>
                                    <span>Mobile Payment</span>
                                </button>
                                <button
                                    className={`checkout__payment-option ${paymentData.method === 'bank_transfer' ? 'checkout__payment-option--active' : ''}`}
                                    onClick={() => setPaymentData((p) => ({ ...p, method: 'bank_transfer' }))}
                                >
                                    <strong>Bank Transfer</strong>
                                    <span>Direct Deposit</span>
                                </button>
                            </div>

                            {/* Payment Instructions */}
                            <div className="checkout__payment-info">
                                {paymentData.method === 'telebirr' ? (
                                    <>
                                        <h3>Telebirr Payment Details</h3>
                                        <div className="checkout__payment-detail">
                                            <span>Phone Number:</span>
                                            <strong>+251 9XX XXX XXXX</strong>
                                        </div>
                                        <div className="checkout__payment-detail">
                                            <span>Account Name:</span>
                                            <strong>Alora Abayas</strong>
                                        </div>
                                        <div className="checkout__payment-detail">
                                            <span>Amount:</span>
                                            <strong>ETB {total.toLocaleString()}</strong>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3>Bank Transfer Details</h3>
                                        <div className="checkout__payment-detail">
                                            <span>Bank:</span>
                                            <strong>Commercial Bank of Ethiopia</strong>
                                        </div>
                                        <div className="checkout__payment-detail">
                                            <span>Account:</span>
                                            <strong>1000XXXXXXXXXX</strong>
                                        </div>
                                        <div className="checkout__payment-detail">
                                            <span>Name:</span>
                                            <strong>Alora Abayas</strong>
                                        </div>
                                        <div className="checkout__payment-detail">
                                            <span>Amount:</span>
                                            <strong>ETB {total.toLocaleString()}</strong>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Screenshot Upload */}
                            <div className="checkout__upload">
                                <h3>Upload Payment Screenshot *</h3>
                                <p className="checkout__upload-hint">
                                    After making your payment, take a screenshot and upload it here. (JPG, PNG, or PDF, max 5MB)
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,application/pdf"
                                    onChange={handleFileChange}
                                    className="checkout__file-input"
                                    id="payment-screenshot"
                                />
                                <label htmlFor="payment-screenshot" className="checkout__upload-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                    {paymentData.screenshot ? 'Change File' : 'Choose File'}
                                </label>

                                {paymentData.screenshotPreview && paymentData.screenshot?.type.startsWith('image/') && (
                                    <div className="checkout__preview">
                                        <img src={paymentData.screenshotPreview} alt="Payment screenshot preview" />
                                        <span>{paymentData.screenshot.name}</span>
                                    </div>
                                )}
                                {paymentData.screenshot && !paymentData.screenshot.type.startsWith('image/') && (
                                    <div className="checkout__preview">
                                        <span>📄 {paymentData.screenshot.name}</span>
                                    </div>
                                )}
                            </div>

                            <div className="checkout__nav-row">
                                <button onClick={() => setStep('shipping')} className="checkout__back-step-btn">
                                    ← Back to Shipping
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    className="checkout__place-order-btn"
                                    disabled={!paymentData.screenshot}
                                >
                                    Place Order
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ---- CONFIRMATION STEP ---- */}
                    {step === 'confirmation' && order && (
                        <div className="checkout__section checkout__confirmation">
                            <div className="checkout__confirmation-icon">✓</div>
                            <h2 className="checkout__section-title">Order Placed Successfully!</h2>
                            <p className="checkout__confirmation-status">Status: <strong>Pending Verification</strong></p>

                            <div className="checkout__order-details">
                                <div className="checkout__order-row">
                                    <span>Order ID:</span>
                                    <strong>{order.orderId.slice(0, 8).toUpperCase()}</strong>
                                </div>
                                <div className="checkout__order-row">
                                    <span>Date:</span>
                                    <strong>{order.orderDate.toLocaleDateString()}</strong>
                                </div>
                                <div className="checkout__order-row">
                                    <span>Payment:</span>
                                    <strong>{order.paymentMethod === 'telebirr' ? 'Telebirr' : 'Bank Transfer'}</strong>
                                </div>
                                <div className="checkout__order-row">
                                    <span>Total:</span>
                                    <strong>ETB {order.total.toLocaleString()}</strong>
                                </div>
                                <div className="checkout__order-row">
                                    <span>Items:</span>
                                    <strong>{order.items.length} items</strong>
                                </div>
                            </div>

                            <div className="checkout__delivery-info">
                                <h3>Estimated Delivery</h3>
                                <p>Your order will be delivered within <strong>3-7 business days</strong> after payment verification.</p>
                            </div>

                            <button onClick={() => navigate('/')} className="checkout__continue-btn">
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>

                {/* Order Summary Sidebar (visible during shipping & payment) */}
                {step !== 'confirmation' && (
                    <aside className="checkout__sidebar">
                        <h3 className="checkout__sidebar-title">Order Summary</h3>
                        <div className="checkout__sidebar-items">
                            {items.map((item) => (
                                <div key={item.id} className="checkout__sidebar-item">
                                    <img src={item.product.images[0]} alt={item.product.name} />
                                    <div>
                                        <p className="checkout__sidebar-item-name">{item.product.name}</p>
                                        <p className="checkout__sidebar-item-opts">{item.selectedSize} / {item.selectedColor} × {item.quantity}</p>
                                    </div>
                                    <span>ETB {(item.product.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="checkout__sidebar-totals">
                            <div className="checkout__sidebar-row">
                                <span>Subtotal</span><span>ETB {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="checkout__sidebar-row">
                                <span>Shipping</span><span>ETB {shippingCost.toLocaleString()}</span>
                            </div>
                            <div className="checkout__sidebar-row checkout__sidebar-row--total">
                                <span>Total</span><span>ETB {total.toLocaleString()}</span>
                            </div>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default Checkout;
