// ============================================
// Common Enums (mirroring Prisma enums for use in DTOs/Guards)
// ============================================

export { Role, OrderStatus, PaymentMethod } from '@prisma/client';

/**
 * Valid order status transitions.
 * Each key is the current status, value is array of valid next statuses.
 */
export const ORDER_STATUS_TRANSITIONS: Record<string, string[]> = {
    PENDING_PAYMENT: ['PAYMENT_SUBMITTED', 'CANCELLED'],
    PAYMENT_SUBMITTED: ['PAYMENT_VERIFIED', 'REJECTED', 'CANCELLED'],
    PAYMENT_VERIFIED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [],       // Terminal state
    REJECTED: [],        // Terminal state
    CANCELLED: [],       // Terminal state
};
