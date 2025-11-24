import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../config/database';
import { AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

export const createTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { projectId, type, amount, description, category, latitude, longitude, transactionDate } = req.body;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return next(new AppError(404, 'Project not found'));
    }

    if (project.beneficiaryId !== req.user!.userId && req.user!.role !== 'ADMIN') {
      return next(new AppError(403, 'Not authorized'));
    }

    const transaction = await prisma.transaction.create({
      data: {
        projectId,
        userId: req.user!.userId,
        type,
        amount: parseFloat(amount),
        description,
        category,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
      },
    });

    // Update project budget spent amount
    if (type === 'EXPENSE') {
      await prisma.projectBudget.updateMany({
        where: { projectId },
        data: {
          spentAmount: {
            increment: parseFloat(amount),
          },
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { type, startDate, endDate } = req.query;

    const where: any = { projectId: id };
    if (type) where.type = type;
    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate.gte = new Date(startDate as string);
      if (endDate) where.transactionDate.lte = new Date(endDate as string);
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        media: true,
      },
      orderBy: { transactionDate: 'desc' },
    });

    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        media: true,
      },
    });

    if (!transaction) {
      return next(new AppError(404, 'Transaction not found'));
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadTransactionMedia = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(new AppError(400, 'No files uploaded'));
    }

    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) {
      return next(new AppError(404, 'Transaction not found'));
    }

    const mediaRecords = await Promise.all(
      files.map((file) =>
        prisma.transactionMedia.create({
          data: {
            transactionId: id,
            mediaUrl: file.path,
            mediaType: file.mimetype.startsWith('image/') ? 'image' : file.mimetype.startsWith('video/') ? 'video' : 'document',
          },
        })
      )
    );

    res.status(201).json({
      success: true,
      message: 'Media uploaded successfully',
      data: mediaRecords,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectLedger = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const [transactions, budget] = await Promise.all([
      prisma.transaction.findMany({
        where: { projectId: id },
        orderBy: { transactionDate: 'asc' },
      }),
      prisma.projectBudget.findUnique({
        where: { projectId: id },
      }),
    ]);

    const totalExpenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalRevenue = transactions
      .filter((t) => t.type === 'REVENUE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    res.json({
      success: true,
      data: {
        budget: budget || null,
        transactions,
        summary: {
          totalExpenses,
          totalRevenue,
          netAmount: totalRevenue - totalExpenses,
          transactionCount: transactions.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createTransactionValidation = [
  body('projectId').notEmpty(),
  body('type').isIn(['EXPENSE', 'REVENUE']),
  body('amount').isFloat({ min: 0 }),
  body('description').trim().notEmpty(),
];

