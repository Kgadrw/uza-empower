import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  submitKYC,
  getKYCStatus,
  getPendingKYC,
  approveKYC,
  rejectKYC
} from '../controllers/kyc.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/submit', submitKYC);
router.get('/status/:id?', getKYCStatus);
router.get('/pending', requireRole('admin'), getPendingKYC);
router.patch('/:id/approve', requireRole('admin'), approveKYC);
router.patch('/:id/reject', requireRole('admin'), rejectKYC);

export default router;

