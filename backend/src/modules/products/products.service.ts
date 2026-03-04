// ============================================
// Products Service — Full CRUD with filtering, pagination, slug
// ============================================

import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../../prisma/prisma.service';
import {
    CreateProductDto,
    UpdateProductDto,
    ProductQueryDto,
    UpdateStockDto,
} from './dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Create a new product with auto-generated slug.
     */
    async create(dto: CreateProductDto) {
        // Validate category exists
        const category = await this.prisma.category.findUnique({
            where: { id: dto.categoryId },
        });
        if (!category) {
            throw new BadRequestException('Category not found');
        }

        const slug = await this.generateUniqueSlug(dto.name);

        return this.prisma.product.create({
            data: {
                ...dto,
                slug,
                price: new Prisma.Decimal(dto.price),
            },
            include: {
                category: true,
                images: { orderBy: { displayOrder: 'asc' } },
            },
        });
    }

    /**
     * Find all products with filtering, pagination, and sorting.
     * For customer requests: only active, non-deleted products.
     */
    async findAll(query: ProductQueryDto, isAdmin = false) {
        const {
            category,
            minPrice,
            maxPrice,
            size,
            color,
            search,
            featured,
            page = 1,
            limit = 12,
            sort = 'newest',
        } = query;

        const where: Prisma.ProductWhereInput = {
            ...(!isAdmin && { isActive: true }),
            deletedAt: null,
        };

        // Category filter (by slug)
        if (category) {
            where.category = { slug: category };
        }

        // Price range filter
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined) {
                where.price.gte = new Prisma.Decimal(minPrice);
            }
            if (maxPrice !== undefined) {
                where.price.lte = new Prisma.Decimal(maxPrice);
            }
        }

        // Size filter (array contains)
        if (size) {
            where.sizes = { has: size };
        }

        // Color filter (array contains)
        if (color) {
            where.colors = { has: color };
        }

        // Featured filter
        if (featured !== undefined) {
            where.featured = featured;
        }

        // Search filter
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Sorting
        let orderBy: Prisma.ProductOrderByWithRelationInput;
        switch (sort) {
            case 'price_asc':
                orderBy = { price: 'asc' };
                break;
            case 'price_desc':
                orderBy = { price: 'desc' };
                break;
            case 'name':
                orderBy = { name: 'asc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
                break;
        }

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    category: true,
                    images: {
                        orderBy: { displayOrder: 'asc' },
                    },
                },
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            },
        };
    }

    /**
     * Find a single product by slug (for customer) or ID (for admin).
     */
    async findBySlug(slug: string) {
        const product = await this.prisma.product.findFirst({
            where: {
                slug,
                isActive: true,
                deletedAt: null,
            },
            include: {
                category: true,
                images: { orderBy: { displayOrder: 'asc' } },
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async findById(id: string) {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: null },
            include: {
                category: true,
                images: { orderBy: { displayOrder: 'asc' } },
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    /**
     * Update a product.
     */
    async update(id: string, dto: UpdateProductDto) {
        await this.findById(id);

        // If category is being changed, validate it exists
        if (dto.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: dto.categoryId },
            });
            if (!category) {
                throw new BadRequestException('Category not found');
            }
        }

        const data: any = { ...dto };

        // Regenerate slug if name changed
        if (dto.name) {
            data.slug = await this.generateUniqueSlug(dto.name, id);
        }

        // Convert price to Decimal
        if (dto.price !== undefined) {
            data.price = new Prisma.Decimal(dto.price);
        }

        return this.prisma.product.update({
            where: { id },
            data,
            include: {
                category: true,
                images: { orderBy: { displayOrder: 'asc' } },
            },
        });
    }

    /**
     * Soft-delete a product.
     */
    async remove(id: string) {
        await this.findById(id);
        return this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false },
        });
    }

    /**
     * Update product stock directly.
     */
    async updateStock(id: string, dto: UpdateStockDto) {
        await this.findById(id);
        return this.prisma.product.update({
            where: { id },
            data: { stock: dto.stock },
        });
    }

    /**
     * Generate a unique slug from a product name.
     */
    private async generateUniqueSlug(
        name: string,
        excludeId?: string,
    ): Promise<string> {
        let slug = slugify(name, { lower: true, strict: true });
        let counter = 0;
        let candidateSlug = slug;

        while (true) {
            const existing = await this.prisma.product.findFirst({
                where: {
                    slug: candidateSlug,
                    ...(excludeId && { id: { not: excludeId } }),
                },
            });

            if (!existing) {
                return candidateSlug;
            }

            counter++;
            candidateSlug = `${slug}-${counter}`;
        }
    }
}
