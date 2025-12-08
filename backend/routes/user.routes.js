import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  getCurrentUser,
  getUserById,
  updateUser,
  updateProfile,
  deleteUser,
  getAllUsers,
  updateUserRole
} from '../controllers/user.controller.js';

const router = express.Router();

// Public routes
// None - all user routes require authentication

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.put('/me', authenticate, updateProfile);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, requireRole('admin'), deleteUser);

// Admin only routes
router.get('/', authenticate, requireRole('admin'), getAllUsers);
router.patch('/:id/role', authenticate, requireRole('admin'), updateUserRole);

export default router;

