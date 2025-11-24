import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

export const releaseTranche = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id, trancheId } = req.params;
    const { releaseReason } = req.body;

    const tranche = await prisma.tranche.findUnique({
      where: { id: trancheId },
    });

    if (!tranche || tranche.projectId !== id) {
      return next(new AppError(404, 'Tranche not found'));
    }

    if (tranche.status !== 'PENDING') {
      return next(new AppError(400, 'Tranche cannot be released'));
    }

    const updated = await prisma.tranche.update({
      where: { id: trancheId },
      data: {
        status: 'RELEASED',
        releaseDate: new Date(),
        releaseReason,
      },
    });

    // Update project budget
    await prisma.projectBudget.updateMany({
      where: { projectId: id },
      data: {
        allocatedAmount: {
          increment: tranche.amount,
        },
      },
    });

    res.json({
      success: true,
      message: 'Tranche released successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const freezeTranche = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id, trancheId } = req.params;
    const { reason } = req.body;

    const tranche = await prisma.tranche.findUnique({
      where: { id: trancheId },
    });

    if (!tranche || tranche.projectId !== id) {
      return next(new AppError(404, 'Tranche not found'));
    }

    if (tranche.status !== 'RELEASED') {
      return next(new AppError(400, 'Only released tranches can be frozen'));
    }

    const updated = await prisma.tranche.update({
      where: { id: trancheId },
      data: {
        status: 'FROZEN',
        frozenAt: new Date(),
        frozenBy: req.user!.userId,
      },
    });

    res.json({
      success: true,
      message: 'Tranche frozen',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectTranches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const tranches = await prisma.tranche.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: tranches,
    });
  } catch (error) {
    next(error);
  }
};

