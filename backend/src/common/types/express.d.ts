import { Role } from '@prisma/client';

/**
 * Represents the authenticated user extracted from Supabase JWT.
 * Attached to Express Request by SupabaseAuthGuard.
 */
export interface AuthenticatedUser {
    id: string;          // Internal DB user ID
    authId: string;      // Supabase Auth UID
    email: string;
    role: Role;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}
