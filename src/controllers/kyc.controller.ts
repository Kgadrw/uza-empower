import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import prisma from '../config/database';
import { AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

export const submitKYC = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const {
      documentType,
      documentNumber,
      businessName,
      businessRegistration,
      address,
      city,
      country,
    } = req.body;

    const documentUrl = req.file?.path;

    // Check if KYC already exists
    const existingKYC = await prisma.kYC.findUnique({ where: { userId } });
    
    if (existingKYC && existingKYC.status === 'APPROVED') {
      return next(new AppError(400, 'KYC already approved'));
    }

    const kyc = await prisma.kYC.upsert({
      where: { userId },
      update: {
        documentType,
        documentNumber,
        documentUrl: documentUrl || existingKYC?.documentUrl,
        businessName,
        businessRegistration,
        address,
        city,
        country,
        status: 'PENDING',
        submittedAt: new Date(),
      },
      create: {
        userId,
        documentType,
        documentNumber,
        documentUrl,
        businessName,
        businessRegistration,
        address,
        city,
        country,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      success: true,
      message: 'KYC submitted successfully',
      data: kyc,
    });
  } catch (error) {
    next(error);
  }
};

export const getKYCStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const kyc = await prisma.kYC.findUnique({
      where: { userId },
    });

    if (!kyc) {
      return res.json({
        success: true,
        data: { status: 'NOT_SUBMITTED' },
      });
    }

    res.json({
      success: true,
      data: kyc,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingKYC = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const kycList = await prisma.kYC.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    res.json({
      success: true,
      data: kycList,
    });
  } catch (error) {
    next(error);
  }
};

export const approveKYC = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const kyc = await prisma.kYC.findUnique({ where: { id } });
    if (!kyc) {
      return next(new AppError(404, 'KYC not found'));
    }

    const updated = await prisma.kYC.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedBy: req.user!.userId,
        reviewedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'KYC approved successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectKYC = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const kyc = await prisma.kYC.findUnique({ where: { id } });
    if (!kyc) {
      return next(new AppError(404, 'KYC not found'));
    }

    const updated = await prisma.kYC.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedBy: req.user!.userId,
        reviewedAt: new Date(),
        rejectionReason,
      },
    });

    res.json({
      success: true,
      message: 'KYC rejected',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const submitKYCValidation = [
  body('documentType').notEmpty(),
  body('documentNumber').notEmpty(),
  body('address').optional(),
  body('city').optional(),
  body('country').optional(),
];

