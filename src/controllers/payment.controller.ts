import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../utils/errors';

export const handlePaymentWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transactionId, status, amount, paymentMethod, metadata } = req.body;

    // Verify webhook signature in production
    // For now, we'll just process the webhook

    const payment = await prisma.payment.create({
      data: {
        transactionId,
        amount: parseFloat(amount),
        status: status.toUpperCase(),
        paymentMethod,
        metadata: metadata || null,
      },
    });

    // If payment is completed and linked to a pledge, update pledge status
    if (metadata?.pledgeId && status === 'COMPLETED') {
      await prisma.pledge.update({
        where: { id: metadata.pledgeId },
        data: {
          status: 'CONFIRMED',
          paymentId: payment.id,
        },
      });

      // Update project current amount
      const pledge = await prisma.pledge.findUnique({
        where: { id: metadata.pledgeId },
        select: { projectId: true, amount: true },
      });

      if (pledge) {
        await prisma.project.update({
          where: { id: pledge.projectId },
          data: {
            currentAmount: {
              increment: pledge.amount,
            },
          },
        });
      }
    }

    res.json({
      success: true,
      message: 'Webhook processed',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return next(new AppError(404, 'Payment not found'));
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const payments = await prisma.payment.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

