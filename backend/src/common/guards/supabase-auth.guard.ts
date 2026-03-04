// ============================================
// Supabase Auth Guard
// Verifies JWT from Supabase and attaches user to request
// ============================================

import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedUser } from '../types/express';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    private supabase: SupabaseClient;

    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        this.supabase = createClient(
            this.configService.getOrThrow<string>('SUPABASE_URL'),
            this.configService.getOrThrow<string>('SUPABASE_ANON_KEY'),
        );
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException('Missing authentication token');
        }

        try {
            // Verify the JWT with Supabase
            const {
                data: { user: supabaseUser },
                error,
            } = await this.supabase.auth.getUser(token);

            if (error || !supabaseUser) {
                throw new UnauthorizedException('Invalid or expired token');
            }

            // Find or create internal user record
            let dbUser = await this.prisma.user.findUnique({
                where: { authId: supabaseUser.id },
            });

            if (!dbUser) {
                // Auto-create user record on first API call
                dbUser = await this.prisma.user.create({
                    data: {
                        authId: supabaseUser.id,
                        email: supabaseUser.email!,
                        name:
                            supabaseUser.user_metadata?.name ||
                            supabaseUser.email?.split('@')[0] ||
                            'User',
                    },
                });
            }

            if (!dbUser.isActive) {
                throw new UnauthorizedException('Account is deactivated');
            }

            // Attach user to request
            const authenticatedUser: AuthenticatedUser = {
                id: dbUser.id,
                authId: dbUser.authId,
                email: dbUser.email,
                role: dbUser.role,
            };

            request.user = authenticatedUser;
            return true;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Authentication failed');
        }
    }

    private extractToken(request: any): string | null {
        // Try Authorization header first
        const authHeader = request.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }

        // Try cookie
        const cookieToken = request.cookies?.['sb-access-token'];
        if (cookieToken) {
            return cookieToken;
        }

        return null;
    }
}
