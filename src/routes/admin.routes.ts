import { Router } from 'express';
import {
  getDashboard,
  getReviewQueue,
  getRiskHeatmap,
  getAuditLog,
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.get('/dashboard', authenticate, authorize(UserRole.ADMIN), getDashboard);
router.get('/review-queue', authenticate, authorize(UserRole.ADMIN), getReviewQueue);
router.get('/risk-heatmap', authenticate, authorize(UserRole.ADMIN), getRiskHeatmap);
router.get('/audit-log', authenticate, authorize(UserRole.ADMIN), getAuditLog);

export default router;

