import {
    Controller, Post, Delete, Param, UseGuards,
    UseInterceptors, UploadedFile, ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Role } from '@prisma/client';
import { UploadService } from './upload.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/express';

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('payment')
    @Throttle({ default: { ttl: 60000, limit: 10 } }) // 10 uploads per minute
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload payment screenshot' })
    uploadPayment(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.uploadService.uploadPaymentScreenshot(file, user.id);
    }

    @Post('product/:productId')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: '[ADMIN] Upload product image' })
    uploadProductImage(
        @UploadedFile() file: Express.Multer.File,
        @Param('productId', ParseUUIDPipe) productId: string,
    ) {
        return this.uploadService.uploadProductImage(file, productId);
    }

    @Delete('product-image/:imageId')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: '[ADMIN] Delete product image' })
    deleteProductImage(@Param('imageId', ParseUUIDPipe) imageId: string) {
        return this.uploadService.deleteProductImage(imageId);
    }
}
