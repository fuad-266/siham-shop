import {
    IsString,
    IsNumber,
    IsOptional,
    IsArray,
    IsBoolean,
    IsPositive,
    Min,
    MinLength,
    ArrayMinSize,
    IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'Classic Black Everyday Abaya' })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({ example: 'A timeless black abaya perfect for daily wear.' })
    @IsString()
    @MinLength(10)
    description: string;

    @ApiProperty({ example: 1200 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number;

    @ApiProperty({ example: 50 })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({ example: 'uuid-of-category' })
    @IsUUID()
    categoryId: string;

    @ApiProperty({ example: ['S', 'M', 'L', 'XL'] })
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    sizes: string[];

    @ApiProperty({ example: ['Black', 'Navy'] })
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    colors: string[];

    @ApiPropertyOptional({ example: 'Premium Nida fabric' })
    @IsOptional()
    @IsString()
    material?: string;

    @ApiPropertyOptional({ example: 'ABY-001' })
    @IsOptional()
    @IsString()
    sku?: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateProductDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(3)
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(10)
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    sizes?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    colors?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    material?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    sku?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class ProductQueryDto {
    @ApiPropertyOptional({ example: 'casual' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ example: 500 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @ApiPropertyOptional({ example: 5000 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @ApiPropertyOptional({ example: 'M' })
    @IsOptional()
    @IsString()
    size?: string;

    @ApiPropertyOptional({ example: 'Black' })
    @IsOptional()
    @IsString()
    color?: string;

    @ApiPropertyOptional({ example: 'abaya' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    featured?: boolean;

    @ApiPropertyOptional({ example: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 12, default: 12 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 12;

    @ApiPropertyOptional({ enum: ['price_asc', 'price_desc', 'newest', 'name'] })
    @IsOptional()
    @IsString()
    sort?: string = 'newest';
}

export class UpdateStockDto {
    @ApiProperty({ example: 10 })
    @IsNumber()
    @Min(0)
    stock: number;
}
