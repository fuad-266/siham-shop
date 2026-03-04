// ============================================
// Global Exception Filter
// Structured error responses for all exceptions
// ============================================

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

interface ErrorResponse {
    statusCode: number;
    message: string | string[];
    error: string;
    timestamp: string;
    path: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | string[] = 'Internal server error';
        let error = 'Internal Server Error';

        // ── NestJS HttpException ──
        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                const res = exceptionResponse as any;
                message = res.message || exception.message;
                error = res.error || exception.name;
            }
        }

        // ── Prisma Errors ──
        else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            switch (exception.code) {
                case 'P2002': // Unique constraint violation
                    statusCode = HttpStatus.CONFLICT;
                    const fields = (exception.meta?.target as string[])?.join(', ') || 'field';
                    message = `A record with this ${fields} already exists`;
                    error = 'Conflict';
                    break;
                case 'P2003': // Foreign key constraint violation
                    statusCode = HttpStatus.BAD_REQUEST;
                    message = 'Referenced record does not exist';
                    error = 'Bad Request';
                    break;
                case 'P2025': // Record not found
                    statusCode = HttpStatus.NOT_FOUND;
                    message = 'Record not found';
                    error = 'Not Found';
                    break;
                default:
                    statusCode = HttpStatus.BAD_REQUEST;
                    message = 'Database operation failed';
                    error = 'Bad Request';
            }
        }

        // ── Prisma Validation Error ──
        else if (exception instanceof Prisma.PrismaClientValidationError) {
            statusCode = HttpStatus.BAD_REQUEST;
            message = 'Invalid data provided';
            error = 'Validation Error';
        }

        // ── Unknown errors ──
        else if (exception instanceof Error) {
            message = exception.message;
        }

        // Log server errors
        if (statusCode >= 500) {
            this.logger.error(
                `${request.method} ${request.url} - ${statusCode}`,
                exception instanceof Error ? exception.stack : String(exception),
            );
        } else {
            this.logger.warn(
                `${request.method} ${request.url} - ${statusCode}: ${JSON.stringify(message)}`,
            );
        }

        const errorResponse: ErrorResponse = {
            statusCode,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        response.status(statusCode).json(errorResponse);
    }
}
