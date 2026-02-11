import { asyncHandler } from '../middlewares/error.middleware.js';
import logger from '../utils/logger.js';

// In-memory user storage (shared with auth controller)
// In production, this would be replaced with database queries
const users = new Map();

/**
 * Get all users
 * GET /api/v1/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
    const userList = Array.from(users.values()).map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    }));

    res.status(200).json({
        success: true,
        count: userList.length,
        data: {
            users: userList,
        },
    });
});

/**
 * Get user by ID
 * GET /api/v1/users/:id
 */
export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find user by ID
    const user = Array.from(users.values()).find((u) => u.id === id);

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
 * Update user
 * PUT /api/v1/users/:id
 */
export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    // Find user by ID
    const user = Array.from(users.values()).find((u) => u.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    // Check if user is updating their own profile or is admin
    if (req.user.id !== id && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to update this user',
        });
    }

    // Check if new email already exists
    if (email && email !== user.email && users.has(email)) {
        return res.status(409).json({
            success: false,
            message: 'Email already in use',
        });
    }

    // Update user
    const oldEmail = user.email;
    if (name) user.name = name;
    if (email) user.email = email;
    user.updatedAt = new Date().toISOString();

    // Update map key if email changed
    if (email && email !== oldEmail) {
        users.delete(oldEmail);
        users.set(email, user);
    }

    logger.info(`User updated: ${user.email}`);

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        },
    });
});

/**
 * Delete user
 * DELETE /api/v1/users/:id
 */
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find user by ID
    const user = Array.from(users.values()).find((u) => u.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    // Check if user is deleting their own account or is admin
    if (req.user.id !== id && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to delete this user',
        });
    }

    // Delete user
    users.delete(user.email);

    logger.info(`User deleted: ${user.email}`);

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });
});
