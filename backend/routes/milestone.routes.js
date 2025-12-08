import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  createMilestone,
  getMilestones,
  getMilestoneById,
  submitMilestoneEvidence,
  approveMilestone,
  rejectMilestone
} from '../controllers/milestone.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createMilestone);
router.get('/', getMilestones);
router.get('/:id', getMilestoneById);
router.post('/:id/evidence', submitMilestoneEvidence);
router.patch('/:id/approve', requireRole('admin'), approveMilestone);
router.patch('/:id/reject', requireRole('admin'), rejectMilestone);

export default router;

