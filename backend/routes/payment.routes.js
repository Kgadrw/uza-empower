import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  createPayment,
  getPayment,
  handleWebhook
} from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/webhook', handleWebhook); // Public webhook endpoint
router.use(authenticate);

router.post('/', createPayment);
router.get('/:id', getPayment);

export default router;

