// ErrorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from './BadRequestError';
import { NotFoundError } from './NotFoundError';

export class ErrorHandler {
    static handleError(error: any, request: Request, response: Response, next: NextFunction): void {
        if (error instanceof BadRequestError || error instanceof NotFoundError) {
            // Manejo específico para errores personalizados
            const errorDetails = {
                status: error.statusCode,
                code: error.code,
                message: error.message,
                // Otras propiedades adicionales específicas del error...
            };
            response.status(error.statusCode).json({ error: errorDetails });
        } else {
            // Manejo de errores genéricos
            const statusCode = error.statusCode || 500;
            const errorMessage = error.message || 'Internal Server Error';
            const errorDetails = {
                status: statusCode,
                message: errorMessage,
            };
            response.status(statusCode).json({ error: errorDetails });
        }
    }
}