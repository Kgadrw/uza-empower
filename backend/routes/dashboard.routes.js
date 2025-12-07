import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  getAdminDashboard,
  getDonorDashboard,
  getBeneficiaryDashboard
} from '../controllers/dashboard.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/admin', requireRole('admin'), getAdminDashboard);
router.get('/donor', requireRole('donor', 'admin'), getDonorDashboard);
router.get('/beneficiary', requireRole('beneficiary', 'admin'), getBeneficiaryDashboard);

export default router;
