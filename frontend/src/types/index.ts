// ============================================
// Shared TypeScript types for the frontend
// Mirrors the Prisma schema on the backend
// ============================================

export type Role = 'CUSTOMER' | 'ADMIN';

export type OrderStatus =
    | 'PENDING_PAYMENT'
    | 'PAYMENT_SUBMITTED'
    | 'PAYMENT_VERIFIED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'REJECTED'
    | 'CANCELLED';

export type PaymentMethod = 'TELEBIRR' | 'BANK_TRANSFER';

// ── User ──
export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: Role;
    createdAt: string;
}

// ── Category ──
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    _count?: { products: number };
}

// ── Product Image ──
export interface ProductImage {
    id: string;
    productId: string;
    imageUrl: string;
    storagePath: string;
    displayOrder: number;
    isPrimary: boolean;
}

// ── Product ──
export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    isActive: boolean;
    sizes: string[];
    colors: string[];
    material?: string;
    sku?: string;
    featured: boolean;
    category: Category;
    images: ProductImage[];
    createdAt: string;
}

// ── Order Item ──
export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    priceAtPurchase: number;
    size: string;
    color: string;
    product: Product;
}

// ── Shipping Address ──
export interface ShippingAddress {
    id: string;
    orderId: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    postalCode?: string;
    country: string;
}

// ── Order ──
export interface Order {
    id: string;
    userId: string;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentScreenshotUrl?: string;
    paymentReference?: string;
    paymentVerifiedAt?: string;
    trackingNumber?: string;
    totalAmount: number;
    notes?: string;
    adminNotes?: string;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    user: Pick<User, 'id' | 'name' | 'email' | 'phone'>;
    createdAt: string;
    updatedAt: string;
}

// ── Cart Item (client-side) ──
export interface CartItem {
    productId: string;
    product: Product;
    quantity: number;
    size: string;
    color: string;
}

// ── Paginated Response ──
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage?: boolean;
        hasPrevPage?: boolean;
    };
}

// ── API Error ──
export interface ApiError {
    statusCode: number;
    message: string | string[];
    error: string;
    timestamp: string;
    path: string;
}

// ── Analytics ──
export interface DashboardMetrics {
    revenue: number;
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
    totalUsers: number;
    recentOrders: Order[];
    ordersByStatus: { status: OrderStatus; count: number }[];
}

// ── Order status display helpers ──
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING_PAYMENT: 'Pending Payment',
    PAYMENT_SUBMITTED: 'Payment Submitted',
    PAYMENT_VERIFIED: 'Payment Verified',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
    PAYMENT_SUBMITTED: 'bg-blue-100 text-blue-800',
    PAYMENT_VERIFIED: 'bg-green-100 text-green-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-emerald-100 text-emerald-800',
    REJECTED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
};
