import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../config/database';
import { AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

export const createDispute = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return next(new AppError(404, 'Project not found'));
    }

    const dispute = await prisma.dispute.create({
      data: {
        projectId: id,
        raisedBy: req.user!.userId,
        title,
        description,
        status: 'OPEN',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Dispute created successfully',
      data: dispute,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyDisputes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const disputes = await prisma.dispute.findMany({
      where: { raisedBy: req.user!.userId },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: disputes,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingDisputes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const disputes = await prisma.dispute.findMany({
      where: {
        status: {
          in: ['OPEN', 'IN_REVIEW'],
        },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        raisedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: disputes,
    });
  } catch (error) {
    next(error);
  }
};

export const resolveDispute = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;

    const dispute = await prisma.dispute.findUnique({ where: { id } });
    if (!dispute) {
      return next(new AppError(404, 'Dispute not found'));
    }

    const updated = await prisma.dispute.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedBy: req.user!.userId,
        resolvedAt: new Date(),
        resolution,
      },
    });

    res.json({
      success: true,
      message: 'Dispute resolved',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const createDisputeValidation = [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
];

