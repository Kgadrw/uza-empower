import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../config/database';
import { AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

export const createPledge = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, amount } = req.body;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return next(new AppError(404, 'Project not found'));
    }

    if (project.status !== 'APPROVED' && project.status !== 'ACTIVE') {
      return next(new AppError(400, 'Project is not available for funding'));
    }

    const pledge = await prisma.pledge.create({
      data: {
        projectId,
        donorId: req.user!.userId,
        amount: parseFloat(amount),
        status: 'PENDING',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Pledge created successfully',
      data: pledge,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPledges = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const pledges = await prisma.pledge.findMany({
      where: { donorId: req.user!.userId },
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
      data: pledges,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectPledges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const pledges = await prisma.pledge.findMany({
      where: { projectId: id },
      include: {
        donor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: pledges,
    });
  } catch (error) {
    next(error);
  }
};

export const getPledgeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const pledge = await prisma.pledge.findUnique({
      where: { id },
      include: {
        project: true,
        donor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!pledge) {
      return next(new AppError(404, 'Pledge not found'));
    }

    res.json({
      success: true,
      data: pledge,
    });
  } catch (error) {
    next(error);
  }
};

export const createPledgeValidation = [
  body('projectId').notEmpty(),
  body('amount').isFloat({ min: 0 }),
];

