import { Router } from 'express';
import {
  sendSMS,
  sendWhatsApp,
  sendEmail,
  sendSMSValidation,
  sendWhatsAppValidation,
  sendEmailValidation,
} from '../controllers/messaging.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/sms', authenticate, authorize(UserRole.ADMIN), validate(sendSMSValidation), sendSMS);
router.post('/whatsapp', authenticate, authorize(UserRole.ADMIN), validate(sendWhatsAppValidation), sendWhatsApp);
router.post('/email', authenticate, authorize(UserRole.ADMIN), validate(sendEmailValidation), sendEmail);

export default router;

