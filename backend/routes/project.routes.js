import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
  approveProject,
  rejectProject,
  getProjectKPIs,
  getProjectAnalytics,
  getProjectTransactions,
  getProjectMilestones
} from '../controllers/project.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public project routes (authenticated users)
router.get('/', getProjects);
router.get('/mine', getMyProjects);
router.get('/:id', getProjectById);
router.get('/:id/kpis', getProjectKPIs);
router.get('/:id/analytics', getProjectAnalytics);
router.get('/:id/transactions', getProjectTransactions);
router.get('/:id/milestones', getProjectMilestones);

// Beneficiary routes
router.post('/', requireRole('beneficiary', 'admin'), createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Admin routes
router.patch('/:id/approve', requireRole('admin'), approveProject);
router.patch('/:id/reject', requireRole('admin'), rejectProject);

export default router;

