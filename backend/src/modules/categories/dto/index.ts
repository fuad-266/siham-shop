import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Casual' })
    @IsString()
    @MinLength(2)
    name: string;

    @ApiPropertyOptional({ example: 'Comfortable everyday abayas' })
    @IsOptional()
    @IsString()
    description?: string;
}

export class UpdateCategoryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;
}
