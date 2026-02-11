import config from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Global error handler middleware
 * Catches all errors and sends appropriate response
 */
export const errorHandler = (err, req, res, next) => {
    // Log error
    logger.error('Error occurred:', err);

    // Default error status and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    }

    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid data format';
    }

    if (err.code === 11000) {
        // MongoDB duplicate key error
        statusCode = 409;
        message = 'Duplicate entry';
    }

    // Send error response
    const errorResponse = {
        success: false,
        message,
        ...(config.isDevelopment() && {
            error: err.message,
            stack: err.stack,
        }),
    };

    res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 * Catches all undefined routes
 */
export const notFoundHandler = (req, res, next) => {
    const error = new Error(`Route not found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

/**
 * Async handler wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Request validation middleware
 * Validates request body against schema
 */
export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
            });
        }

        next();
    };
};
