import app from './app.js';
import config from './config/env.js';
import logger from './utils/logger.js';

/**
 * Normalize port
 */
const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
};

const PORT = normalizePort(config.port);

/**
 * Start server
 */
const server = app.listen(PORT, () => {
    logger.success(`🚀 Server running in ${config.env} mode`);
    logger.info(`📡 Listening on port ${PORT}`);
    logger.info(`🌐 API URL: http://${config.host}:${PORT}${config.api.prefix}`);
    logger.info(`💚 Health check: http://${config.host}:${PORT}${config.api.prefix}/health`);

    if (config.isDevelopment()) {
        logger.debug('Debug mode enabled');
    }
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);

    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);

    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});

/**
 * Graceful shutdown
 */
const gracefulShutdown = (signal) => {
    logger.warn(`${signal} received. Starting graceful shutdown...`);

    server.close(() => {
        logger.info('Server closed. Process terminating...');
        process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default server;
