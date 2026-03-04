import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../types/express';

/**
 * Parameter decorator to extract the authenticated user from the request.
 * Usage: @CurrentUser() user: AuthenticatedUser
 * Usage: @CurrentUser('id') userId: string
 */
export const CurrentUser = createParamDecorator(
    (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user as AuthenticatedUser;

        if (!user) {
            return null;
        }

        return data ? user[data] : user;
    },
);
