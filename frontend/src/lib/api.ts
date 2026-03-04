// ============================================
// Axios API Client — Communicates with NestJS backend
// ============================================

import axios from 'axios';
import { createClient } from '@/lib/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Configured Axios instance for the NestJS backend.
 * Automatically attaches Supabase JWT to every request.
 */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 30000,
});

// ── Request Interceptor: Attach JWT ──
api.interceptors.request.use(
    async (config) => {
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.access_token) {
                config.headers.Authorization = `Bearer ${session.access_token}`;
            }
        } catch {
            // Silently fail — unauthed requests are fine for public endpoints
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// ── Response Interceptor: Handle errors ──
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 — try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const supabase = createClient();
                const { data: { session }, error: refreshError } =
                    await supabase.auth.refreshSession();

                if (refreshError || !session) {
                    // Redirect to login
                    if (typeof window !== 'undefined') {
                        window.location.href = '/auth/login';
                    }
                    return Promise.reject(error);
                }

                originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
                return api(originalRequest);
            } catch {
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
            }
        }

        return Promise.reject(error);
    },
);

export default api;

// ── Typed API helpers ──

export const productsApi = {
    list: (params?: Record<string, any>) =>
        api.get('/products', { params }),
    getBySlug: (slug: string) =>
        api.get(`/products/slug/${slug}`),
    getById: (id: string) =>
        api.get(`/products/${id}`),
};

export const categoriesApi = {
    list: () => api.get('/categories'),
    getById: (id: string) => api.get(`/categories/${id}`),
};

export const ordersApi = {
    create: (data: any) => api.post('/orders', data),
    list: (params?: Record<string, any>) =>
        api.get('/orders', { params }),
    getById: (id: string) => api.get(`/orders/${id}`),
    submitPayment: (id: string, data: any) =>
        api.patch(`/orders/${id}/payment`, data),
    cancel: (id: string) => api.post(`/orders/${id}/cancel`),
};

export const uploadApi = {
    paymentScreenshot: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload/payment', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

export const usersApi = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data: any) => api.put('/users/profile', data),
};

// ── Admin API helpers ──

export const adminProductsApi = {
    listAll: (params?: Record<string, any>) =>
        api.get('/products/admin/all', { params }),
    create: (data: any) => api.post('/products', data),
    update: (id: string, data: any) => api.put(`/products/${id}`, data),
    delete: (id: string) => api.delete(`/products/${id}`),
    updateStock: (id: string, stock: number) =>
        api.patch(`/products/${id}/stock`, { stock }),
    uploadImage: (productId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/upload/product/${productId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    deleteImage: (imageId: string) =>
        api.delete(`/upload/product-image/${imageId}`),
};

export const adminOrdersApi = {
    list: (params?: Record<string, any>) =>
        api.get('/orders', { params }),
    getById: (id: string) => api.get(`/orders/${id}`),
    updateStatus: (id: string, data: any) =>
        api.patch(`/orders/${id}/status`, data),
    verifyPayment: (id: string, data?: any) =>
        api.patch(`/orders/${id}/verify`, data || {}),
};

export const adminCategoriesApi = {
    create: (data: any) => api.post('/categories', data),
    update: (id: string, data: any) => api.put(`/categories/${id}`, data),
    delete: (id: string) => api.delete(`/categories/${id}`),
};

export const analyticsApi = {
    dashboard: () => api.get('/analytics/dashboard'),
    sales: (params?: Record<string, any>) =>
        api.get('/analytics/sales', { params }),
    revenue: () => api.get('/analytics/revenue'),
};
