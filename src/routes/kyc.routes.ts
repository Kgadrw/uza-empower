import { Router } from 'express';
import {
  submitKYC,
  getKYCStatus,
  getPendingKYC,
  approveKYC,
  rejectKYC,
  submitKYCValidation,
} from '../controllers/kyc.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { upload } from '../config/upload';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/submit', authenticate, upload.single('document'), validate(submitKYCValidation), submitKYC);
router.get('/status', authenticate, getKYCStatus);
router.get('/pending', authenticate, authorize(UserRole.ADMIN), getPendingKYC);
router.put('/:id/approve', authenticate, authorize(UserRole.ADMIN), approveKYC);
router.put('/:id/reject', authenticate, authorize(UserRole.ADMIN), rejectKYC);

export default router;

