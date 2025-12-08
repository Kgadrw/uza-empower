import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  createDispute,
  getDisputes,
  resolveDispute
} from '../controllers/dispute.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createDispute);
router.get('/', getDisputes);
router.patch('/:id/resolve', requireRole('admin'), resolveDispute);

export default router;

