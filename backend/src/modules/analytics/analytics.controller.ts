import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AnalyticsService } from './analytics.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('dashboard')
    @ApiOperation({ summary: '[ADMIN] Dashboard overview metrics' })
    getDashboard() {
        return this.analyticsService.getDashboardMetrics();
    }

    @Get('sales')
    @ApiOperation({ summary: '[ADMIN] Sales report by period' })
    getSales(
        @Query('period') period?: 'day' | 'week' | 'month',
        @Query('months') months?: number,
    ) {
        return this.analyticsService.getSalesReport(period, months);
    }

    @Get('revenue')
    @ApiOperation({ summary: '[ADMIN] Revenue breakdown' })
    getRevenue() {
        return this.analyticsService.getRevenueReport();
    }
}
