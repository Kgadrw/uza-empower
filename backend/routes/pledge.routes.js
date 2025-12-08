import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  createPledge,
  getPledges,
  getPledgeById,
  confirmPledge,
  cancelPledge
} from '../controllers/pledge.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/', requireRole('donor', 'admin'), createPledge);
router.get('/', getPledges);
router.get('/:id', getPledgeById);
router.patch('/:id/confirm', confirmPledge);
router.patch('/:id/cancel', cancelPledge);

export default router;

