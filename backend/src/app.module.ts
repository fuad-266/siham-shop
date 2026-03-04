// ============================================
// Alora Abayas — Root Application Module
// ============================================

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UploadModule } from './modules/upload/upload.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
    imports: [
        // ── Configuration ──
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // ── Global Rate Limiting ──
        ThrottlerModule.forRoot([
            {
                name: 'short',
                ttl: 1000,   // 1 second
                limit: 10,    // 10 requests per second
            },
            {
                name: 'medium',
                ttl: 10000,   // 10 seconds
                limit: 50,    // 50 requests per 10 seconds
            },
            {
                name: 'long',
                ttl: 60000,   // 1 minute
                limit: 100,   // 100 requests per minute
            },
        ]),

        // ── Core Modules ──
        PrismaModule,
        AuthModule,
        UsersModule,
        ProductsModule,
        CategoriesModule,
        OrdersModule,
        UploadModule,
        AnalyticsModule,
    ],
    providers: [
        // Apply rate limiting globally
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
