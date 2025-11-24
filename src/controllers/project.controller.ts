import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../config/database';
import { AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      description,
      category,
      targetAmount,
      location,
      latitude,
      longitude,
      startDate,
      endDate,
    } = req.body;

    const project = await prisma.project.create({
      data: {
        beneficiaryId: req.user!.userId,
        title,
        description,
        category,
        targetAmount: parseFloat(targetAmount),
        location,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: 'DRAFT',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, category, search } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          beneficiary: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ]);

    res.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await prisma.project.findMany({
      where: { beneficiaryId: req.user!.userId },
      include: {
        budget: true,
        kpis: true,
        _count: {
          select: {
            pledges: true,
            transactions: true,
            milestones: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        beneficiary: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        budget: true,
        kpis: true,
        _count: {
          select: {
            pledges: true,
            transactions: true,
            milestones: true,
          },
        },
      },
    });

    if (!project) {
      return next(new AppError(404, 'Project not found'));
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      targetAmount,
      location,
      latitude,
      longitude,
      startDate,
      endDate,
    } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return next(new AppError(404, 'Project not found'));
    }

    if (project.beneficiaryId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      return next(new AppError(403, 'Not authorized to update this project'));
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        category,
        targetAmount: targetAmount ? parseFloat(targetAmount) : undefined,
        location,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProjectStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return next(new AppError(404, 'Project not found'));
    }

    const updateData: any = {
      status,
      approvedBy: req.user!.userId,
      approvedAt: new Date(),
    };

    if (status === 'REJECTED' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updated = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Project status updated',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectBudget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const budget = await prisma.projectBudget.findUnique({
      where: { projectId: id },
    });

    if (!budget) {
      return next(new AppError(404, 'Budget not found'));
    }

    res.json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProjectBudget = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { totalBudget, breakdown } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return next(new AppError(404, 'Project not found'));
    }

    if (project.beneficiaryId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      return next(new AppError(403, 'Not authorized'));
    }

    const budget = await prisma.projectBudget.upsert({
      where: { projectId: id },
      update: {
        totalBudget: parseFloat(totalBudget),
        breakdown: breakdown ? JSON.parse(breakdown) : undefined,
      },
      create: {
        projectId: id,
        totalBudget: parseFloat(totalBudget),
        breakdown: breakdown ? JSON.parse(breakdown) : null,
      },
    });

    res.json({
      success: true,
      message: 'Budget updated successfully',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectKPIs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const kpis = await prisma.projectKPI.findUnique({
      where: { projectId: id },
    });

    if (!kpis) {
      return res.json({
        success: true,
        data: {
          beneficiariesReached: 0,
          jobsCreated: 0,
          revenueGenerated: 0,
          impactMetrics: null,
        },
      });
    }

    res.json({
      success: true,
      data: kpis,
    });
  } catch (error) {
    next(error);
  }
};

export const getImpactReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        kpis: true,
        budget: true,
        transactions: {
          select: {
            type: true,
            amount: true,
            createdAt: true,
          },
        },
        milestones: {
          select: {
            title: true,
            status: true,
            completedAt: true,
          },
        },
      },
    });

    if (!project) {
      return next(new AppError(404, 'Project not found'));
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const completeProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return next(new AppError(404, 'Project not found'));
    }

    if (project.beneficiaryId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      return next(new AppError(403, 'Not authorized'));
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Project marked as completed',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const createProjectValidation = [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('targetAmount').isFloat({ min: 0 }),
];

