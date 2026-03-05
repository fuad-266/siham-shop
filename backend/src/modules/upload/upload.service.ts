// ============================================
// Upload Service — Supabase Storage integration
// ============================================

import {
    Injectable,
    BadRequestException,
    PayloadTooLargeException,
    UnsupportedMediaTypeException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../../prisma/prisma.service';
// UUID generation using crypto (Node.js built-in)

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PAYMENT_SIZE = 5 * 1024 * 1024;    // 5 MB
const MAX_PRODUCT_SIZE = 10 * 1024 * 1024;   // 10 MB

@Injectable()
export class UploadService {
    private readonly supabase: SupabaseClient;
    private readonly logger = new Logger(UploadService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        this.supabase = createClient(
            this.configService.getOrThrow('SUPABASE_URL'),
            this.configService.getOrThrow('SUPABASE_SERVICE_ROLE_KEY'),
        );
    }

    /**
     * Upload a payment screenshot to private bucket.
     */
    async uploadPaymentScreenshot(
        file: Express.Multer.File,
        userId: string,
    ) {
        this.validateFile(file, MAX_PAYMENT_SIZE);

        const ext = this.getExtension(file.originalname);
        const path = `payments/${userId}/${Date.now()}-${this.generateId()}.${ext}`;

        const { data, error } = await this.supabase.storage
            .from('payment-proofs')
            .upload(path, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            this.logger.error('Payment screenshot upload failed', error);
            throw new InternalServerErrorException('File upload failed');
        }

        // Get signed URL (valid for 7 days)
        const { data: urlData } = await this.supabase.storage
            .from('payment-proofs')
            .createSignedUrl(path, 7 * 24 * 60 * 60);

        return {
            path: data.path,
            url: urlData?.signedUrl || '',
        };
    }

    /**
     * Upload a product image to public bucket.
     */
    async uploadProductImage(
        file: Express.Multer.File,
        productId: string,
    ) {
        this.validateFile(file, MAX_PRODUCT_SIZE);

        // Verify product exists
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { images: true },
        });

        if (!product) {
            throw new BadRequestException('Product not found');
        }

        const ext = this.getExtension(file.originalname);
        const path = `products/${productId}/${Date.now()}-${this.generateId()}.${ext}`;

        const { data, error } = await this.supabase.storage
            .from('product-images')
            .upload(path, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            this.logger.error('Product image upload failed', error);
            throw new InternalServerErrorException('File upload failed');
        }

        // Get public URL
        const { data: urlData } = this.supabase.storage
            .from('product-images')
            .getPublicUrl(path);

        // Create ProductImage record
        const isPrimary = product.images.length === 0; // First image is primary
        const displayOrder = product.images.length;

        const productImage = await this.prisma.productImage.create({
            data: {
                productId,
                imageUrl: urlData.publicUrl,
                storagePath: data.path,
                displayOrder,
                isPrimary,
            },
        });

        return productImage;
    }

    /**
     * Delete a product image from storage and database.
     */
    async deleteProductImage(imageId: string) {
        const image = await this.prisma.productImage.findUnique({
            where: { id: imageId },
        });

        if (!image) {
            throw new BadRequestException('Image not found');
        }

        // Delete from Supabase Storage
        const { error } = await this.supabase.storage
            .from('product-images')
            .remove([image.storagePath]);

        if (error) {
            this.logger.error('Image deletion from storage failed', error);
        }

        // Delete from database
        await this.prisma.productImage.delete({ where: { id: imageId } });

        // If this was the primary image, promote the next one
        if (image.isPrimary) {
            const nextImage = await this.prisma.productImage.findFirst({
                where: { productId: image.productId },
                orderBy: { displayOrder: 'asc' },
            });

            if (nextImage) {
                await this.prisma.productImage.update({
                    where: { id: nextImage.id },
                    data: { isPrimary: true },
                });
            }
        }

        return { message: 'Image deleted successfully' };
    }

    // ── Private Helpers ──

    private validateFile(file: Express.Multer.File, maxSize: number): void {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new UnsupportedMediaTypeException(
                `Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
            );
        }

        if (file.size > maxSize) {
            throw new PayloadTooLargeException(
                `File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds maximum ${(maxSize / 1024 / 1024)}MB`,
            );
        }

        // Sanitize filename
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        if (sanitized !== file.originalname) {
            file.originalname = sanitized;
        }
    }

    private getExtension(filename: string): string {
        const parts = filename.split('.');
        return parts.length > 1 ? parts.pop()!.toLowerCase() : 'jpg';
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 10);
    }
}
