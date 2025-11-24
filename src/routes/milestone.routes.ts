import { Router } from 'express';
import {
  createMilestone,
  getProjectMilestones,
  uploadMilestoneEvidence,
  approveMilestone,
  rejectMilestone,
  createMilestoneValidation,
} from '../controllers/milestone.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { upload } from '../config/upload';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/projects/:id/milestones', authenticate, validate(createMilestoneValidation), createMilestone);
router.get('/projects/:id/milestones', getProjectMilestones);
router.post('/milestones/:id/evidence', authenticate, upload.single('evidence'), uploadMilestoneEvidence);
router.put('/milestones/:id/approve', authenticate, authorize(UserRole.ADMIN), approveMilestone);
router.put('/milestones/:id/reject', authenticate, authorize(UserRole.ADMIN), rejectMilestone);

export default router;

