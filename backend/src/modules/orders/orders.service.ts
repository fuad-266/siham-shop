// ============================================
// Orders Service — Transactional creation with row locking
// ============================================

import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { Prisma, OrderStatus, Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../../common/types/express';
import {
    CreateOrderDto,
    UpdateOrderStatusDto,
    VerifyPaymentDto,
    SubmitPaymentDto,
    OrderQueryDto,
} from './dto';
import {
    validateStatusTransition,
    requiresTrackingNumber,
    requiresStockRestoration,
    CANCELLABLE_STATUSES,
} from './order-state-machine';

// Include relations for order queries
const ORDER_INCLUDE = {
    items: {
        include: {
            product: {
                include: {
                    images: { where: { isPrimary: true }, take: 1 },
                },
            },
        },
    },
    shippingAddress: true,
    user: {
        select: { id: true, name: true, email: true, phone: true },
    },
} satisfies Prisma.OrderInclude;

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create an order using a database transaction with row-level locking.
     * 
     * Flow:
     * 1. BEGIN TRANSACTION
     * 2. Lock product rows with SELECT FOR UPDATE
     * 3. Validate stock availability
     * 4. Decrement stock for all items
     * 5. Create order + order items + shipping address
     * 6. COMMIT (or ROLLBACK on any failure)
     */
    async create(dto: CreateOrderDto, user: AuthenticatedUser) {
        return this.prisma.$transaction(async (tx) => {
            let totalAmount = new Prisma.Decimal(0);
            const orderItemsData: Array<{
                productId: string;
                quantity: number;
                priceAtPurchase: Prisma.Decimal;
                size: string;
                color: string;
            }> = [];

            // ── Step 1: Lock and validate each product ──
            for (const item of dto.items) {
                // Row-level lock: SELECT FOR UPDATE prevents concurrent modifications
                const [product] = await tx.$queryRaw<
                    Array<{
                        id: string;
                        name: string;
                        price: Prisma.Decimal;
                        stock: number;
                        sizes: string[];
                        colors: string[];
                        is_active: boolean;
                        deleted_at: Date | null;
                    }>
                >`
          SELECT id, name, price, stock, sizes, colors, is_active, deleted_at
          FROM products
          WHERE id = ${item.productId}::uuid
          FOR UPDATE
        `;

                if (!product || product.deleted_at || !product.is_active) {
                    throw new NotFoundException(
                        `Product ${item.productId} not found or unavailable`,
                    );
                }

                // Validate stock
                if (product.stock < item.quantity) {
                    throw new ConflictException(
                        `Insufficient stock for "${product.name}". ` +
                        `Available: ${product.stock}, Requested: ${item.quantity}`,
                    );
                }

                // Validate size
                if (!product.sizes.includes(item.size)) {
                    throw new BadRequestException(
                        `Size "${item.size}" is not available for "${product.name}". ` +
                        `Available sizes: ${product.sizes.join(', ')}`,
                    );
                }

                // Validate color
                if (!product.colors.includes(item.color)) {
                    throw new BadRequestException(
                        `Color "${item.color}" is not available for "${product.name}". ` +
                        `Available colors: ${product.colors.join(', ')}`,
                    );
                }

                const priceAtPurchase = new Prisma.Decimal(product.price.toString());
                totalAmount = totalAmount.add(
                    priceAtPurchase.mul(new Prisma.Decimal(item.quantity)),
                );

                orderItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    priceAtPurchase,
                    size: item.size,
                    color: item.color,
                });

                // ── Step 2: Decrement stock ──
                await tx.$executeRaw`
          UPDATE products
          SET stock = stock - ${item.quantity}, updated_at = NOW()
          WHERE id = ${item.productId}::uuid
        `;
            }

            // ── Step 3: Create Order ──
            const order = await tx.order.create({
                data: {
                    userId: user.id,
                    status: OrderStatus.PENDING_PAYMENT,
                    paymentMethod: dto.paymentMethod,
                    paymentScreenshotUrl: dto.paymentScreenshotUrl,
                    paymentScreenshotPath: dto.paymentScreenshotPath,
                    totalAmount,
                    notes: dto.notes,
                    items: {
                        create: orderItemsData,
                    },
                    shippingAddress: {
                        create: {
                            fullName: dto.shippingAddress.fullName,
                            phone: dto.shippingAddress.phone,
                            street: dto.shippingAddress.street,
                            city: dto.shippingAddress.city,
                            postalCode: dto.shippingAddress.postalCode,
                            country: dto.shippingAddress.country || 'Ethiopia',
                        },
                    },
                },
                include: ORDER_INCLUDE,
            });

            return order;
        }, {
            // Transaction options
            maxWait: 10000,    // 10s max wait to acquire lock
            timeout: 30000,    // 30s max transaction duration
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        });
    }

    /**
     * Find all orders. Customers see only their own; admins see all.
     */
    async findAll(query: OrderQueryDto, user: AuthenticatedUser) {
        const { status, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.OrderWhereInput = {};

        // Customers can only see their own orders
        if (user.role !== Role.ADMIN) {
            where.userId = user.id;
        }

        if (status) {
            where.status = status;
        }

        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: ORDER_INCLUDE,
            }),
            this.prisma.order.count({ where }),
        ]);

        return {
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Find a single order by ID with ownership check.
     */
    async findById(id: string, user: AuthenticatedUser) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: ORDER_INCLUDE,
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Customers can only view their own orders
        if (user.role !== Role.ADMIN && order.userId !== user.id) {
            throw new ForbiddenException('You can only view your own orders');
        }

        return order;
    }

    /**
     * Update order status with state machine validation.
     * Admin only.
     */
    async updateStatus(
        id: string,
        dto: UpdateOrderStatusDto,
        admin: AuthenticatedUser,
    ) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) throw new NotFoundException('Order not found');

        // Validate state machine transition
        validateStatusTransition(order.status, dto.status);

        // Tracking number is now optional for SHIPPED status
        // Removed strict validation check here

        // Handle stock restoration on cancellation
        if (requiresStockRestoration(order.status, dto.status)) {
            return this.cancelOrderWithStockRestore(id, admin, dto.adminNotes);
        }

        const updateData: Prisma.OrderUpdateInput = {
            status: dto.status,
            adminNotes: dto.adminNotes,
        };

        if (dto.trackingNumber) {
            updateData.trackingNumber = dto.trackingNumber;
        }

        return this.prisma.order.update({
            where: { id },
            data: updateData,
            include: ORDER_INCLUDE,
        });
    }

    /**
     * Verify payment — admin only.
     */
    async verifyPayment(
        id: string,
        dto: VerifyPaymentDto,
        admin: AuthenticatedUser,
    ) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) throw new NotFoundException('Order not found');

        validateStatusTransition(order.status, OrderStatus.PAYMENT_VERIFIED);

        return this.prisma.order.update({
            where: { id },
            data: {
                status: OrderStatus.PAYMENT_VERIFIED,
                paymentVerifiedAt: new Date(),
                paymentVerifiedById: admin.id,
                paymentReference: dto.paymentReference,
                adminNotes: dto.adminNotes,
            },
            include: ORDER_INCLUDE,
        });
    }

    /**
     * Submit payment screenshot — customer only.
     */
    async submitPayment(
        id: string,
        dto: SubmitPaymentDto,
        user: AuthenticatedUser,
    ) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) throw new NotFoundException('Order not found');

        if (order.userId !== user.id) {
            throw new ForbiddenException('You can only submit payment for your own orders');
        }

        validateStatusTransition(order.status, OrderStatus.PAYMENT_SUBMITTED);

        return this.prisma.order.update({
            where: { id },
            data: {
                status: OrderStatus.PAYMENT_SUBMITTED,
                paymentScreenshotUrl: dto.paymentScreenshotUrl,
                paymentScreenshotPath: dto.paymentScreenshotPath,
            },
            include: ORDER_INCLUDE,
        });
    }

    /**
     * Cancel order with transaction + stock restoration.
     */
    async cancelOrder(id: string, user: AuthenticatedUser) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });

        if (!order) throw new NotFoundException('Order not found');

        // Customers can only cancel their own orders
        if (user.role !== Role.ADMIN && order.userId !== user.id) {
            throw new ForbiddenException('You can only cancel your own orders');
        }

        // Only certain statuses allow cancellation
        if (!CANCELLABLE_STATUSES.includes(order.status)) {
            throw new BadRequestException(
                `Cannot cancel order with status '${order.status}'`,
            );
        }

        return this.cancelOrderWithStockRestore(id, user);
    }

    /**
     * Internal: Cancel order + restore stock in a transaction.
     */
    private async cancelOrderWithStockRestore(
        orderId: string,
        user: AuthenticatedUser,
        adminNotes?: string,
    ) {
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: { items: true },
            });

            if (!order) throw new NotFoundException('Order not found');

            // Restore stock for each item
            for (const item of order.items) {
                await tx.$executeRaw`
          UPDATE products
          SET stock = stock + ${item.quantity}, updated_at = NOW()
          WHERE id = ${item.productId}::uuid
        `;
            }

            // Update order status
            return tx.order.update({
                where: { id: orderId },
                data: {
                    status: OrderStatus.CANCELLED,
                    adminNotes: adminNotes || `Cancelled by ${user.role === Role.ADMIN ? 'admin' : 'customer'}`,
                },
                include: ORDER_INCLUDE,
            });
        });
    }
}
