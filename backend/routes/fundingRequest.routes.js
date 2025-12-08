import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  createFundingRequest,
  getFundingRequests,
  getFundingRequestById,
  approveFundingRequest,
  rejectFundingRequest
} from '../controllers/fundingRequest.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createFundingRequest);
router.get('/', getFundingRequests);
router.get('/:id', getFundingRequestById);
router.patch('/:id/approve', requireRole('admin'), approveFundingRequest);
router.patch('/:id/reject', requireRole('admin'), rejectFundingRequest);

export default router;

