import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../controllers/notification.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getNotifications);
router.get('/:id', getNotificationById);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

export default router;

