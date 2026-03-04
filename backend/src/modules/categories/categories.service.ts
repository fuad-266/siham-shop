import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateCategoryDto) {
        const slug = slugify(dto.name, { lower: true, strict: true });
        return this.prisma.category.create({
            data: { ...dto, slug },
        });
    }

    async findAll() {
        return this.prisma.category.findMany({
            where: { isActive: true },
            include: { _count: { select: { products: true } } },
            orderBy: { name: 'asc' },
        });
    }

    async findById(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { products: true } } },
        });
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }

    async update(id: string, dto: UpdateCategoryDto) {
        await this.findById(id);
        const data: any = { ...dto };
        if (dto.name) {
            data.slug = slugify(dto.name, { lower: true, strict: true });
        }
        return this.prisma.category.update({ where: { id }, data });
    }

    async remove(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { products: true } } },
        });
        if (!category) throw new NotFoundException('Category not found');
        if (category._count.products > 0) {
            throw new ConflictException(
                `Cannot delete category with ${category._count.products} associated products. Reassign products first.`,
            );
        }
        return this.prisma.category.delete({ where: { id } });
    }
}
