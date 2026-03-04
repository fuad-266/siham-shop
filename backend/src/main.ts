// ============================================
// Alora Abayas — NestJS Bootstrap
// ============================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug'],
    });

    const configService = app.get(ConfigService);

    // ── Security Middleware ──
    app.use(helmet());

    // ── CORS ──
    const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    app.enableCors({
        origin: [frontendUrl],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        maxAge: 86400,
    });

    // ── Global Pipes ──
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // ── Global Filters ──
    app.useGlobalFilters(new GlobalExceptionFilter());

    // ── API Prefix ──
    app.setGlobalPrefix('api');

    // ── Swagger ──
    if (configService.get('NODE_ENV') !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('Alora Abayas API')
            .setDescription('Production-grade E-Commerce API for Alora Abayas')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api/docs', app, document);
    }

    // ── Start ──
    const port = configService.get<number>('PORT', 3001);
    await app.listen(port);
    console.log(`🚀 Alora Abayas API running on port ${port}`);
    console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
