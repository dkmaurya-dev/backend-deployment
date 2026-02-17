import { asyncHandler } from "../middlewares/error.middleware.js";

/**
 * Health check controller
 * Returns API health status
 */
export const healthCheck = asyncHandler(async (req, res) => {
  const healthData = {
    success: true,
    message: "API is running and healthy :)|Deepak1",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    memory: {
      used:
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total:
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      unit: "MB",
    },
  };

  res.status(200).json(healthData);
});

/**
 * Detailed health check
 * Returns comprehensive system information
 */
export const detailedHealthCheck = asyncHandler(async (req, res) => {
  const healthData = {
    success: true,
    message: "API is running1",
    timestamp: new Date().toISOString(),
    system: {
      uptime: process.uptime(),
      platform: process.platform,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || "development",
    },
    memory: {
      heapUsed:
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      heapTotal:
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      rss: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
      external:
        Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100,
      unit: "MB",
    },
    cpu: {
      usage: process.cpuUsage(),
    },
  };

  res.status(200).json(healthData);
});
