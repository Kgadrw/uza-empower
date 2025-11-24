import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../config/database';
import { AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

export const createTopUp = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return next(new AppError(404, 'Project not found'));
    }

    if (project.beneficiaryId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      return next(new AppError(403, 'Not authorized'));
    }

    const topUp = await prisma.topUpRequest.create({
      data: {
        projectId: id,
        amount: parseFloat(amount),
        reason,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Top-up request created successfully',
      data: topUp,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectTopUps = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const topUps = await prisma.topUpRequest.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: topUps,
    });
  } catch (error) {
    next(error);
  }
};

export const approveTopUp = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const topUp = await prisma.topUpRequest.findUnique({ where: { id } });
    if (!topUp) {
      return next(new AppError(404, 'Top-up request not found'));
    }

    const updated = await prisma.topUpRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy: req.user!.userId,
        approvedAt: new Date(),
      },
    });

    // Update project current amount
    await prisma.project.update({
      where: { id: topUp.projectId },
      data: {
        currentAmount: {
          increment: topUp.amount,
        },
      },
    });

    res.json({
      success: true,
      message: 'Top-up request approved',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectTopUp = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const topUp = await prisma.topUpRequest.findUnique({ where: { id } });
    if (!topUp) {
      return next(new AppError(404, 'Top-up request not found'));
    }

    const updated = await prisma.topUpRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        approvedBy: req.user!.userId,
        approvedAt: new Date(),
        rejectionReason,
      },
    });

    res.json({
      success: true,
      message: 'Top-up request rejected',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const createTopUpValidation = [
  body('amount').isFloat({ min: 0 }),
  body('reason').trim().notEmpty(),
];

