// ============================================
// Analytics Service — Revenue, sales, and dashboard metrics
// ============================================

import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Get dashboard overview metrics.
     */
    async getDashboardMetrics() {
        const [
            totalRevenue,
            totalOrders,
            pendingOrders,
            totalProducts,
            totalUsers,
            recentOrders,
            ordersByStatus,
        ] = await Promise.all([
            // Total revenue from delivered orders
            this.prisma.order.aggregate({
                where: { status: OrderStatus.DELIVERED },
                _sum: { totalAmount: true },
            }),
            // Total order count
            this.prisma.order.count(),
            // Pending verification count
            this.prisma.order.count({
                where: {
                    status: {
                        in: [OrderStatus.PENDING_PAYMENT, OrderStatus.PAYMENT_SUBMITTED],
                    },
                },
            }),
            // Active products count
            this.prisma.product.count({
                where: { isActive: true, deletedAt: null },
            }),
            // Total customers
            this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
            // 5 most recent orders
            this.prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true, email: true } },
                },
            }),
            // Order count by status
            this.prisma.order.groupBy({
                by: ['status'],
                _count: { id: true },
            }),
        ]);

        return {
            revenue: totalRevenue._sum.totalAmount || 0,
            totalOrders,
            pendingOrders,
            totalProducts,
            totalUsers,
            recentOrders,
            ordersByStatus: ordersByStatus.map((s) => ({
                status: s.status,
                count: s._count.id,
            })),
        };
    }

    /**
     * Get sales data grouped by time period.
     */
    async getSalesReport(period: 'day' | 'week' | 'month' = 'month', months = 6) {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        let dateFormat: string;
        switch (period) {
            case 'day':
                dateFormat = 'YYYY-MM-DD';
                break;
            case 'week':
                dateFormat = 'IYYY-IW';
                break;
            case 'month':
            default:
                dateFormat = 'YYYY-MM';
                break;
        }

        const salesData = await this.prisma.$queryRaw<
            Array<{ period: string; total_revenue: number; order_count: bigint }>
        >`
      SELECT
        TO_CHAR(created_at, ${dateFormat}) AS period,
        COALESCE(SUM(total_amount), 0) AS total_revenue,
        COUNT(id) AS order_count
      FROM orders
      WHERE created_at >= ${startDate}
        AND status NOT IN ('CANCELLED', 'REJECTED')
      GROUP BY period
      ORDER BY period ASC
    `;

        return salesData.map((row) => ({
            period: row.period,
            revenue: Number(row.total_revenue),
            orders: Number(row.order_count),
        }));
    }

    /**
     * Get revenue breakdown.
     */
    async getRevenueReport() {
        const [totalRevenue, monthlyRevenue, topProducts] = await Promise.all([
            // Total lifetime revenue
            this.prisma.order.aggregate({
                where: { status: OrderStatus.DELIVERED },
                _sum: { totalAmount: true },
                _count: { id: true },
            }),
            // This month's revenue
            this.prisma.order.aggregate({
                where: {
                    status: OrderStatus.DELIVERED,
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
                _sum: { totalAmount: true },
                _count: { id: true },
            }),
            // Top selling products
            this.prisma.orderItem.groupBy({
                by: ['productId'],
                _sum: { quantity: true },
                _count: { id: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 10,
            }),
        ]);

        // Fetch product details for top products
        const productIds = topProducts.map((p) => p.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true, price: true, slug: true },
        });

        const topProductsWithDetails = topProducts.map((tp) => {
            const product = products.find((p) => p.id === tp.productId);
            return {
                product,
                totalQuantitySold: tp._sum.quantity || 0,
                totalOrders: tp._count.id,
            };
        });

        return {
            lifetime: {
                revenue: totalRevenue._sum.totalAmount || 0,
                orders: totalRevenue._count.id,
            },
            thisMonth: {
                revenue: monthlyRevenue._sum.totalAmount || 0,
                orders: monthlyRevenue._count.id,
            },
            topProducts: topProductsWithDetails,
        };
    }
}
