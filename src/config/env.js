import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Environment configuration object
 * Centralizes all environment variables with validation
 */
const config = {
    // Server Configuration
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,
    host: process.env.HOST || 'localhost',

    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },

    // CORS Configuration
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',')
            : ['http://localhost:3000'],
    },

    // API Configuration
    api: {
        prefix: process.env.API_PREFIX || '/api/v1',
    },

    // Rate Limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    },

    // Helper methods
    isDevelopment() {
        return this.env === 'development';
    },

    isProduction() {
        return this.env === 'production';
    },

    isTest() {
        return this.env === 'test';
    },
};

/**
 * Validate required environment variables
 */
const validateConfig = () => {
    const requiredVars = ['JWT_SECRET'];
    const missingVars = [];

    if (config.isProduction()) {
        requiredVars.forEach((varName) => {
            if (!process.env[varName]) {
                missingVars.push(varName);
            }
        });

        if (missingVars.length > 0) {
            throw new Error(
                `Missing required environment variables: ${missingVars.join(', ')}`
            );
        }
    }
};

// Validate on import
validateConfig();

export default config;
