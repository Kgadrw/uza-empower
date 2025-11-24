import { Router } from 'express';
import {
  createFundingRequest,
  getMyFundingRequests,
  getPendingFundingRequests,
  getFundingRequestById,
  approveFundingRequest,
  rejectFundingRequest,
  createFundingRequestValidation,
} from '../controllers/fundingRequest.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/', authenticate, validate(createFundingRequestValidation), createFundingRequest);
router.get('/mine', authenticate, getMyFundingRequests);
router.get('/pending', authenticate, authorize(UserRole.ADMIN), getPendingFundingRequests);
router.get('/:id', authenticate, getFundingRequestById);
router.put('/:id/approve', authenticate, authorize(UserRole.ADMIN), approveFundingRequest);
router.put('/:id/reject', authenticate, authorize(UserRole.ADMIN), rejectFundingRequest);

export default router;

