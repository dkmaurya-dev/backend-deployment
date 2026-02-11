import config from '../config/env.js';

/**
 * Color codes for console output
 */
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

/**
 * Format timestamp
 */
const getTimestamp = () => {
    return new Date().toISOString();
};

/**
 * Logger utility for consistent logging across the application
 */
class Logger {
    /**
     * Log info messages
     */
    info(message, meta = {}) {
        const timestamp = getTimestamp();
        console.log(
            `${colors.cyan}[INFO]${colors.reset} ${colors.dim}${timestamp}${colors.reset} - ${message}`,
            Object.keys(meta).length > 0 ? meta : ''
        );
    }

    /**
     * Log success messages
     */
    success(message, meta = {}) {
        const timestamp = getTimestamp();
        console.log(
            `${colors.green}[SUCCESS]${colors.reset} ${colors.dim}${timestamp}${colors.reset} - ${message}`,
            Object.keys(meta).length > 0 ? meta : ''
        );
    }

    /**
     * Log warning messages
     */
    warn(message, meta = {}) {
        const timestamp = getTimestamp();
        console.warn(
            `${colors.yellow}[WARN]${colors.reset} ${colors.dim}${timestamp}${colors.reset} - ${message}`,
            Object.keys(meta).length > 0 ? meta : ''
        );
    }

    /**
     * Log error messages
     */
    error(message, error = null) {
        const timestamp = getTimestamp();
        console.error(
            `${colors.red}[ERROR]${colors.reset} ${colors.dim}${timestamp}${colors.reset} - ${message}`
        );
        if (error) {
            if (config.isDevelopment()) {
                console.error(error);
            } else {
                console.error(error.message);
            }
        }
    }

    /**
     * Log debug messages (only in development)
     */
    debug(message, meta = {}) {
        if (config.isDevelopment()) {
            const timestamp = getTimestamp();
            console.log(
                `${colors.magenta}[DEBUG]${colors.reset} ${colors.dim}${timestamp}${colors.reset} - ${message}`,
                Object.keys(meta).length > 0 ? meta : ''
            );
        }
    }

    /**
     * Log HTTP requests
     */
    http(method, url, statusCode, responseTime) {
        const timestamp = getTimestamp();
        const statusColor =
            statusCode >= 500
                ? colors.red
                : statusCode >= 400
                    ? colors.yellow
                    : statusCode >= 300
                        ? colors.cyan
                        : colors.green;

        console.log(
            `${colors.blue}[HTTP]${colors.reset} ${colors.dim}${timestamp}${colors.reset} - ${method} ${url} ${statusColor}${statusCode}${colors.reset} ${responseTime}ms`
        );
    }
}

// Export singleton instance
const logger = new Logger();

export default logger;
