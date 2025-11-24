import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../config/database';
import { AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

export const createFundingRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, amount, purpose } = req.body;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return next(new AppError(404, 'Project not found'));
    }

    if (project.beneficiaryId !== req.user!.userId) {
      return next(new AppError(403, 'Not authorized'));
    }

    const fundingRequest = await prisma.fundingRequest.create({
      data: {
        projectId,
        beneficiaryId: req.user!.userId,
        amount: parseFloat(amount),
        purpose,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Funding request created successfully',
      data: fundingRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyFundingRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const requests = await prisma.fundingRequest.findMany({
      where: { beneficiaryId: req.user!.userId },
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
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingFundingRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const requests = await prisma.fundingRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        beneficiary: {
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
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const getFundingRequestById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const request = await prisma.fundingRequest.findUnique({
      where: { id },
      include: {
        project: true,
        beneficiary: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!request) {
      return next(new AppError(404, 'Funding request not found'));
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const approveFundingRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const request = await prisma.fundingRequest.findUnique({ where: { id } });
    if (!request) {
      return next(new AppError(404, 'Funding request not found'));
    }

    const updated = await prisma.fundingRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy: req.user!.userId,
        approvedAt: new Date(),
      },
    });

    // Update project current amount
    await prisma.project.update({
      where: { id: request.projectId },
      data: {
        currentAmount: {
          increment: request.amount,
        },
      },
    });

    res.json({
      success: true,
      message: 'Funding request approved',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectFundingRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const request = await prisma.fundingRequest.findUnique({ where: { id } });
    if (!request) {
      return next(new AppError(404, 'Funding request not found'));
    }

    const updated = await prisma.fundingRequest.update({
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
      message: 'Funding request rejected',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const createFundingRequestValidation = [
  body('projectId').notEmpty(),
  body('amount').isFloat({ min: 0 }),
  body('purpose').trim().notEmpty(),
];

