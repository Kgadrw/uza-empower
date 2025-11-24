import { Router } from 'express';
import {
  createTopUp,
  getProjectTopUps,
  approveTopUp,
  rejectTopUp,
  createTopUpValidation,
} from '../controllers/topUp.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/projects/:id/top-ups', authenticate, validate(createTopUpValidation), createTopUp);
router.get('/projects/:id/top-ups', authenticate, getProjectTopUps);
router.put('/top-ups/:id/approve', authenticate, authorize(UserRole.ADMIN), approveTopUp);
router.put('/top-ups/:id/reject', authenticate, authorize(UserRole.ADMIN), rejectTopUp);

export default router;

