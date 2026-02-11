import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { asyncHandler } from '../middlewares/error.middleware.js';
import logger from '../utils/logger.js';

// In-memory user storage (replace with database in production)
const users = new Map();

/**
 * Generate JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        config.jwt.secret,
        {
            expiresIn: config.jwt.expiresIn,
        }
    );
};

/**
 * Register new user
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide name, email, and password',
        });
    }

    // Check if user already exists
    if (users.has(email)) {
        return res.status(409).json({
            success: false,
            message: 'User already exists with this email',
        });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        name,
        email,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date().toISOString(),
    };

    // Store user
    users.set(email, user);

    logger.info(`New user registered: ${email}`);

    // Generate token
    const token = generateToken(user);

    // Send response
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        },
    });
});

/**
 * Login user
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password',
        });
    }

    // Find user
    const user = users.get(email);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }

    logger.info(`User logged in: ${email}`);

    // Generate token
    const token = generateToken(user);

    // Send response
    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        },
    });
});

/**
 * Get current user
 * GET /api/v1/auth/me
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
    // User is already attached by auth middleware
    const user = users.get(req.user.email);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    res.status(200).json({
        success: true,
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        },
    });
});

/**
 * Logout user
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
    // With JWT, logout is handled client-side by removing the token
    // This endpoint is here for consistency and future enhancements (e.g., token blacklisting)

    logger.info(`User logged out: ${req.user.email}`);

    res.status(200).json({
        success: true,
        message: 'Logout successful',
    });
});
