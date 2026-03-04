// ============================================
// Products Controller
// ============================================

import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ProductsService } from './products.service';
import {
    CreateProductDto,
    UpdateProductDto,
    ProductQueryDto,
    UpdateStockDto,
} from './dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    // ── Public Endpoints ──

    @Get()
    @ApiOperation({ summary: 'List products with filters and pagination' })
    async findAll(@Query() query: ProductQueryDto) {
        return this.productsService.findAll(query, false);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get product by slug (customer)' })
    async findBySlug(@Param('slug') slug: string) {
        return this.productsService.findBySlug(slug);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    async findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.findById(id);
    }

    // ── Admin Endpoints ──

    @Post()
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] Create a new product' })
    async create(@Body() dto: CreateProductDto) {
        return this.productsService.create(dto);
    }

    @Put(':id')
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] Update a product' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateProductDto,
    ) {
        return this.productsService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] Soft-delete a product' })
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.remove(id);
    }

    @Patch(':id/stock')
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] Update product stock' })
    async updateStock(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateStockDto,
    ) {
        return this.productsService.updateStock(id, dto);
    }

    // ── Admin: List all (including inactive) ──

    @Get('admin/all')
    @UseGuards(SupabaseAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: '[ADMIN] List all products including inactive' })
    async findAllAdmin(@Query() query: ProductQueryDto) {
        return this.productsService.findAll(query, true);
    }
}
