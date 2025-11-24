import { Router } from 'express';
import {
  getMe,
  updateMe,
  getUserById,
  updateMeValidation,
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '@prisma/client';

const router = Router();

router.get('/me', authenticate, getMe);
router.put('/me', authenticate, validate(updateMeValidation), updateMe);
router.get('/:id', authenticate, authorize(UserRole.ADMIN), getUserById);

export default router;

