import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/env.js';
import logger from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

// Import routes
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

/**
 * Create Express application
 */
const app = express();

/**
 * CORS Configuration
 */
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (config.cors.allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

/**
 * Middleware
 */
// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger
if (config.isDevelopment()) {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Custom request logger
app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.http(req.method, req.originalUrl, res.statusCode, duration);
    });

    next();
});

/**
 * API Routes
 */
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Backend API',
        version: '1.0.0',
        documentation: `${config.api.prefix}/docs`,
    });
});

// Mount routes
app.use(`${config.api.prefix}/health`, healthRoutes);
app.use(`${config.api.prefix}/auth`, authRoutes);
app.use(`${config.api.prefix}/users`, userRoutes);

/**
 * Error Handlers
 */
// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
