import { Router } from 'express';
import {
  handlePaymentWebhook,
  getPaymentById,
  getProjectPayments,
} from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/webhook', handlePaymentWebhook);
router.get('/:id', authenticate, getPaymentById);
router.get('/projects/:id/payments', authenticate, getProjectPayments);

export default router;

