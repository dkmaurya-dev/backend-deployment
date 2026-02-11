import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/v1/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get('/', authenticate, authorize('admin'), getAllUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', authenticate, getUserById);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user
 * @access  Private (Own profile or Admin)
 */
router.put('/:id', authenticate, updateUser);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user
 * @access  Private (Own profile or Admin)
 */
router.delete('/:id', authenticate, deleteUser);

export default router;
