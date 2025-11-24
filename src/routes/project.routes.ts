import { Router } from 'express';
import {
  createProject,
  getProjects,
  getMyProjects,
  getProjectById,
  updateProject,
  updateProjectStatus,
  getProjectBudget,
  updateProjectBudget,
  getProjectKPIs,
  getImpactReport,
  completeProject,
  createProjectValidation,
} from '../controllers/project.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/', authenticate, validate(createProjectValidation), createProject);
router.get('/', getProjects);
router.get('/mine', authenticate, getMyProjects);
router.get('/:id', getProjectById);
router.put('/:id', authenticate, updateProject);
router.put('/:id/status', authenticate, authorize(UserRole.ADMIN), updateProjectStatus);
router.get('/:id/budget', getProjectBudget);
router.put('/:id/budget', authenticate, updateProjectBudget);
router.get('/:id/kpis', getProjectKPIs);
router.get('/:id/impact-report', getImpactReport);
router.post('/:id/complete', authenticate, completeProject);

export default router;

