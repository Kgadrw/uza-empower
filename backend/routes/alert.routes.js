import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  getAlerts,
  getAlertById,
  createAlert,
  resolveAlert,
  markAlertAsRead
} from '../controllers/alert.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAlerts);
router.get('/:id', getAlertById);
router.post('/', requireRole('admin'), createAlert);
router.patch('/:id/resolve', resolveAlert);
router.patch('/:id/read', markAlertAsRead);

export default router;

