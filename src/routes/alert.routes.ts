import { Router } from 'express';
import {
  getAlerts,
  getProjectAlerts,
  resolveAlert,
} from '../controllers/alert.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.get('/', authenticate, authorize(UserRole.ADMIN), getAlerts);
router.get('/projects/:id/alerts', authenticate, getProjectAlerts);
router.put('/:id/resolve', authenticate, authorize(UserRole.ADMIN), resolveAlert);

export default router;

