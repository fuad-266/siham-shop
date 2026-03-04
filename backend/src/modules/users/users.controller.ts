import {
    Controller, Get, Put, Body, Param, Query,
    UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/express';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    @ApiOperation({ summary: 'Get own profile' })
    getProfile(@CurrentUser() user: AuthenticatedUser) {
        return this.usersService.getProfile(user.id);
    }

    @Put('profile')
    @ApiOperation({ summary: 'Update own profile' })
    updateProfile(
        @CurrentUser() user: AuthenticatedUser,
        @Body() dto: UpdateProfileDto,
    ) {
        return this.usersService.updateProfile(user.id, dto);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[ADMIN] List all users' })
    findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.usersService.findAll(page, limit);
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[ADMIN] Get user by ID' })
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.findById(id);
    }
}
