import { Router } from 'express';
import {
  createDispute,
  getMyDisputes,
  getPendingDisputes,
  resolveDispute,
  createDisputeValidation,
} from '../controllers/dispute.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/projects/:id/disputes', authenticate, validate(createDisputeValidation), createDispute);
router.get('/mine', authenticate, getMyDisputes);
router.get('/pending', authenticate, authorize(UserRole.ADMIN), getPendingDisputes);
router.put('/:id/resolve', authenticate, authorize(UserRole.ADMIN), resolveDispute);

export default router;

