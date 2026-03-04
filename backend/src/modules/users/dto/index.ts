import { IsString, IsOptional, MinLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: 'Amina Mohammed' })
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @ApiPropertyOptional({ example: '+251911234567' })
    @IsOptional()
    @IsString()
    @Matches(/^\+251[0-9]{9}$/, {
        message: 'Phone must match Ethiopian format: +251XXXXXXXXX',
    })
    phone?: string;
}
