import express from 'express';
import { healthCheck, detailedHealthCheck } from '../controllers/health.controller.js';

const router = express.Router();

/**
 * @route   GET /api/v1/health
 * @desc    Basic health check
 * @access  Public
 */
router.get('/', healthCheck);

/**
 * @route   GET /api/v1/health/detailed
 * @desc    Detailed health check with system info
 * @access  Public
 */
router.get('/detailed', detailedHealthCheck);

export default router;
