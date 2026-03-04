import {
    Controller, Get, Post, Patch, Body, Param, Query,
    UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Role } from '@prisma/client';
import { OrdersService } from './orders.service';
import {
    CreateOrderDto, UpdateOrderStatusDto,
    VerifyPaymentDto, SubmitPaymentDto, OrderQueryDto,
} from './dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/express';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @Throttle({ default: { ttl: 60000, limit: 5 } }) // 5 orders per minute
    @ApiOperation({ summary: 'Create a new order (transactional with row locking)' })
    create(@Body() dto: CreateOrderDto, @CurrentUser() user: AuthenticatedUser) {
        return this.ordersService.create(dto, user);
    }

    @Get()
    @ApiOperation({ summary: 'List orders (own for customer, all for admin)' })
    findAll(@Query() query: OrderQueryDto, @CurrentUser() user: AuthenticatedUser) {
        return this.ordersService.findAll(query, user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order by ID (ownership enforced)' })
    findById(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.ordersService.findById(id, user);
    }

    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[ADMIN] Update order status (state machine enforced)' })
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateOrderStatusDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.ordersService.updateStatus(id, dto, user);
    }

    @Patch(':id/verify')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[ADMIN] Verify payment' })
    verifyPayment(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: VerifyPaymentDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.ordersService.verifyPayment(id, dto, user);
    }

    @Patch(':id/payment')
    @Throttle({ default: { ttl: 60000, limit: 5 } })
    @ApiOperation({ summary: 'Submit payment screenshot (customer)' })
    submitPayment(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: SubmitPaymentDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.ordersService.submitPayment(id, dto, user);
    }

    @Post(':id/cancel')
    @ApiOperation({ summary: 'Cancel order (with stock restoration)' })
    cancelOrder(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.ordersService.cancelOrder(id, user);
    }
}
