import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user data to request
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
            });
        }

        // Extract token
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            // Verify token
            const decoded = jwt.verify(token, config.jwt.secret);

            // Attach user data to request
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
            };

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired.',
                });
            }

            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token.',
                });
            }

            throw error;
        }
    } catch (error) {
        logger.error('Authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication.',
        });
    }
};

/**
 * Role-based authorization middleware
 * Checks if authenticated user has required role
 */
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access forbidden. Insufficient permissions.',
            });
        }

        next();
    };
};

/**
 * Optional authentication middleware
 * Attaches user data if token is valid, but doesn't require it
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);

            try {
                const decoded = jwt.verify(token, config.jwt.secret);
                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                    role: decoded.role,
                };
            } catch (error) {
                // Token is invalid, but we don't fail the request
                logger.debug('Optional auth: Invalid token provided');
            }
        }

        next();
    } catch (error) {
        logger.error('Optional authentication middleware error:', error);
        next();
    }
};
