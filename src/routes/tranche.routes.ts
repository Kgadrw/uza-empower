import { Router } from 'express';
import {
  releaseTranche,
  freezeTranche,
  getProjectTranches,
} from '../controllers/tranche.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/projects/:id/tranches/:trancheId/release', authenticate, authorize(UserRole.ADMIN), releaseTranche);
router.post('/projects/:id/tranches/:trancheId/freeze', authenticate, authorize(UserRole.ADMIN), freezeTranche);
router.get('/projects/:id/tranches', authenticate, getProjectTranches);

export default router;

