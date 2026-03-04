import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../../common/types/express';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Get or create an internal user based on Supabase Auth ID.
     */
    async findOrCreateUser(authId: string, email: string, name?: string) {
        let user = await this.prisma.user.findUnique({
            where: { authId },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    authId,
                    email,
                    name: name || email.split('@')[0],
                },
            });
        }

        return user;
    }

    /**
     * Get user by internal ID.
     */
    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}
