import prisma from '../config/database';
import { NotificationType } from '@prisma/client';

export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  metadata?: any
) => {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        metadata: metadata || null,
      },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

