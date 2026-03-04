// ============================================
// Order State Machine
// Strict transition validation for order statuses
// ============================================

import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

/**
 * Valid order status transitions.
 * Each key maps to the array of statuses it can transition TO.
 */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING_PAYMENT]: [
        OrderStatus.PAYMENT_SUBMITTED,
        OrderStatus.CANCELLED,
    ],
    [OrderStatus.PAYMENT_SUBMITTED]: [
        OrderStatus.PAYMENT_VERIFIED,
        OrderStatus.REJECTED,
        OrderStatus.CANCELLED,
    ],
    [OrderStatus.PAYMENT_VERIFIED]: [
        OrderStatus.PROCESSING,
        OrderStatus.CANCELLED,
    ],
    [OrderStatus.PROCESSING]: [
        OrderStatus.SHIPPED,
        OrderStatus.CANCELLED,
    ],
    [OrderStatus.SHIPPED]: [
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
    ],
    [OrderStatus.DELIVERED]: [],   // Terminal state
    [OrderStatus.REJECTED]: [],    // Terminal state
    [OrderStatus.CANCELLED]: [],   // Terminal state
};

/**
 * Statuses that allow cancellation (stock must be restored).
 */
export const CANCELLABLE_STATUSES: OrderStatus[] = [
    OrderStatus.PENDING_PAYMENT,
    OrderStatus.PAYMENT_SUBMITTED,
    OrderStatus.PAYMENT_VERIFIED,
    OrderStatus.PROCESSING,
];

/**
 * Terminal statuses — no further transitions allowed.
 */
export const TERMINAL_STATUSES: OrderStatus[] = [
    OrderStatus.DELIVERED,
    OrderStatus.REJECTED,
    OrderStatus.CANCELLED,
];

/**
 * Statuses where stock has been decremented and needs restoration on cancel.
 */
export const STOCK_DECREMENTED_STATUSES: OrderStatus[] = [
    OrderStatus.PENDING_PAYMENT,
    OrderStatus.PAYMENT_SUBMITTED,
    OrderStatus.PAYMENT_VERIFIED,
    OrderStatus.PROCESSING,
    OrderStatus.SHIPPED,
];

/**
 * Validates that a status transition is allowed.
 * @throws BadRequestException if transition is invalid.
 */
export function validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
): void {
    if (TERMINAL_STATUSES.includes(currentStatus)) {
        throw new BadRequestException(
            `Order is in terminal state '${currentStatus}' and cannot be modified`,
        );
    }

    const allowedTransitions = VALID_TRANSITIONS[currentStatus];

    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
        throw new BadRequestException(
            `Invalid status transition from '${currentStatus}' to '${newStatus}'. ` +
            `Allowed transitions: ${allowedTransitions?.join(', ') || 'none'}`,
        );
    }
}

/**
 * Check if an order requires a tracking number for the given status.
 */
export function requiresTrackingNumber(status: OrderStatus): boolean {
    return status === OrderStatus.SHIPPED;
}

/**
 * Check if transitioning to this status requires stock restoration.
 */
export function requiresStockRestoration(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
): boolean {
    return (
        newStatus === OrderStatus.CANCELLED &&
        STOCK_DECREMENTED_STATUSES.includes(currentStatus)
    );
}
