import {
    IsString, IsNumber, IsOptional, IsArray, IsEnum, IsPositive,
    Min, ValidateNested, MinLength, ArrayMinSize, IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentMethod } from '@prisma/client';

// ── Order Item ──

export class CreateOrderItemDto {
    @ApiProperty()
    @IsUUID()
    productId: string;

    @ApiProperty({ example: 2 })
    @IsNumber()
    @IsPositive()
    @Min(1)
    quantity: number;

    @ApiProperty({ example: 'M' })
    @IsString()
    size: string;

    @ApiProperty({ example: 'Black' })
    @IsString()
    color: string;
}

// ── Shipping Address ──

export class CreateShippingAddressDto {
    @ApiProperty({ example: 'Amina Mohammed' })
    @IsString()
    @MinLength(2)
    fullName: string;

    @ApiProperty({ example: '+251911234567' })
    @IsString()
    @MinLength(10)
    phone: string;

    @ApiProperty({ example: 'Bole Road, Building 42' })
    @IsString()
    @MinLength(5)
    street: string;

    @ApiProperty({ example: 'Addis Ababa' })
    @IsString()
    @MinLength(2)
    city: string;

    @ApiPropertyOptional({ example: '1000' })
    @IsOptional()
    @IsString()
    postalCode?: string;

    @ApiPropertyOptional({ example: 'Ethiopia', default: 'Ethiopia' })
    @IsOptional()
    @IsString()
    country?: string;
}

// ── Create Order ──

export class CreateOrderDto {
    @ApiProperty({ type: [CreateOrderItemDto] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];

    @ApiProperty({ type: CreateShippingAddressDto })
    @ValidateNested()
    @Type(() => CreateShippingAddressDto)
    shippingAddress: CreateShippingAddressDto;

    @ApiProperty({ enum: PaymentMethod })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiPropertyOptional({ example: 'https://storage.url/screenshot.jpg' })
    @IsOptional()
    @IsString()
    paymentScreenshotUrl?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    paymentScreenshotPath?: string;

    @ApiPropertyOptional({ example: 'Please deliver in the morning' })
    @IsOptional()
    @IsString()
    notes?: string;
}

// ── Update Order Status ──

export class UpdateOrderStatusDto {
    @ApiProperty({ enum: OrderStatus })
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @ApiPropertyOptional({ example: 'TRK-123456' })
    @IsOptional()
    @IsString()
    trackingNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    adminNotes?: string;
}

// ── Verify Payment ──

export class VerifyPaymentDto {
    @ApiPropertyOptional({ example: 'TXN-REF-12345' })
    @IsOptional()
    @IsString()
    paymentReference?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    adminNotes?: string;
}

// ── Submit Payment Screenshot ──

export class SubmitPaymentDto {
    @ApiProperty()
    @IsString()
    paymentScreenshotUrl: string;

    @ApiProperty()
    @IsString()
    paymentScreenshotPath: string;
}

// ── Order Query ──

export class OrderQueryDto {
    @ApiPropertyOptional({ enum: OrderStatus })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @ApiPropertyOptional({ example: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 20, default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 20;
}
