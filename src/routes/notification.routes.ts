import { Router } from 'express';
import {
  getNotifications,
  markNotificationAsRead,
} from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getNotifications);
router.put('/:id/read', authenticate, markNotificationAsRead);

export default router;

