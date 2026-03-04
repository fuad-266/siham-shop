import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, name: true, email: true, phone: true,
                role: true, createdAt: true,
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        await this.getProfile(userId);
        return this.prisma.user.update({
            where: { id: userId },
            data: dto,
            select: {
                id: true, name: true, email: true, phone: true,
                role: true, createdAt: true, updatedAt: true,
            },
        });
    }

    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip, take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true, name: true, email: true, phone: true,
                    role: true, isActive: true, createdAt: true,
                    _count: { select: { orders: true } },
                },
            }),
            this.prisma.user.count(),
        ]);
        return { data: users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true, name: true, email: true, phone: true,
                role: true, isActive: true, createdAt: true, updatedAt: true,
                _count: { select: { orders: true } },
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }
}
