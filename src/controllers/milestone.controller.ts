import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../config/database';
import { AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

export const createMilestone = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, targetDate } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return next(new AppError(404, 'Project not found'));
    }

    if (project.beneficiaryId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      return next(new AppError(403, 'Not authorized'));
    }

    const milestone = await prisma.milestone.create({
      data: {
        projectId: id,
        title,
        description,
        targetDate: targetDate ? new Date(targetDate) : null,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Milestone created successfully',
      data: milestone,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectMilestones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const milestones = await prisma.milestone.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: milestones,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadMilestoneEvidence = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return next(new AppError(400, 'No file uploaded'));
    }

    const milestone = await prisma.milestone.findUnique({ where: { id } });
    if (!milestone) {
      return next(new AppError(404, 'Milestone not found'));
    }

    const project = await prisma.project.findUnique({ where: { id: milestone.projectId } });
    if (!project) {
      return next(new AppError(404, 'Project not found'));
    }

    if (project.beneficiaryId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      return next(new AppError(403, 'Not authorized'));
    }

    const updated = await prisma.milestone.update({
      where: { id },
      data: {
        evidenceUrl: file.path,
        status: 'IN_PROGRESS',
      },
    });

    res.json({
      success: true,
      message: 'Evidence uploaded successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const approveMilestone = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const milestone = await prisma.milestone.findUnique({ where: { id } });
    if (!milestone) {
      return next(new AppError(404, 'Milestone not found'));
    }

    const updated = await prisma.milestone.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy: req.user!.userId,
        approvedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Milestone approved',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectMilestone = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const milestone = await prisma.milestone.findUnique({ where: { id } });
    if (!milestone) {
      return next(new AppError(404, 'Milestone not found'));
    }

    const updated = await prisma.milestone.update({
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
      message: 'Milestone rejected',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const createMilestoneValidation = [
  body('title').trim().notEmpty(),
  body('description').optional(),
  body('targetDate').optional().isISO8601(),
];

