import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

export const getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [
      totalProjects,
      activeProjects,
      totalUsers,
      totalPledges,
      totalFunding,
      pendingKYCs,
      pendingFundingRequests,
      pendingMilestones,
      activeAlerts,
      recentTransactions,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count(),
      prisma.pledge.count(),
      prisma.pledge.aggregate({ _sum: { amount: true } }),
      prisma.kYC.count({ where: { status: 'PENDING' } }),
      prisma.fundingRequest.count({ where: { status: 'PENDING' } }),
      prisma.milestone.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.alert.count({ where: { status: 'ACTIVE' } }),
      prisma.transaction.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalProjects,
          activeProjects,
          totalUsers,
          totalPledges,
          totalFunding: totalPledges._sum.amount || 0,
        },
        pending: {
          kyc: pendingKYCs,
          fundingRequests: pendingFundingRequests,
          milestones: pendingMilestones,
          alerts: activeAlerts,
        },
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewQueue = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [pendingKYCs, pendingProjects, pendingFunding, pendingMilestones, pendingTopUps] = await Promise.all([
      prisma.kYC.findMany({
        where: { status: 'PENDING' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.project.findMany({
        where: { status: 'PENDING_APPROVAL' },
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
        orderBy: { createdAt: 'desc' },
      }),
      prisma.fundingRequest.findMany({
        where: { status: 'PENDING' },
        include: {
          project: {
            select: {
              id: true,
              title: true,
            },
          },
          beneficiary: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.milestone.findMany({
        where: { status: 'IN_PROGRESS' },
        include: {
          project: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.topUpRequest.findMany({
        where: { status: 'PENDING' },
        include: {
          project: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      success: true,
      data: {
        kyc: pendingKYCs,
        projects: pendingProjects,
        fundingRequests: pendingFunding,
        milestones: pendingMilestones,
        topUps: pendingTopUps,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRiskHeatmap = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: {
          in: ['ACTIVE', 'APPROVED'],
        },
      },
      include: {
        alerts: {
          where: { status: 'ACTIVE' },
        },
        transactions: {
          select: {
            amount: true,
            type: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            disputes: true,
          },
        },
      },
    });

    const riskData = projects.map((project) => {
      const alertCount = project.alerts.length;
      const disputeCount = project._count.disputes;
      const recentTransactions = project.transactions.filter(
        (t) => new Date(t.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      const totalSpent = recentTransactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      let riskScore = 0;
      if (alertCount > 0) riskScore += alertCount * 10;
      if (disputeCount > 0) riskScore += disputeCount * 15;
      if (totalSpent > Number(project.targetAmount) * 0.8) riskScore += 20;

      return {
        projectId: project.id,
        projectTitle: project.title,
        riskScore: Math.min(riskScore, 100),
        alertCount,
        disputeCount,
        location: project.location,
        latitude: project.latitude,
        longitude: project.longitude,
      };
    });

    res.json({
      success: true,
      data: riskData,
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { resourceType, resourceId, userId, startDate, endDate } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (resourceType) where.resourceType = resourceType;
    if (resourceId) where.resourceId = resourceId;
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
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
      prisma.auditLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: logs,
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

