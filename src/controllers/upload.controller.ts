import { Request, Response, NextFunction } from 'express';
import { upload } from '../config/upload';
import { AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';
import path from 'path';

export const uploadFile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if (!file) {
      return next(new AppError(400, 'No file uploaded'));
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: file.filename,
        filename: file.originalname,
        url: `/media/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const filePath = path.resolve(uploadDir, id);

    // In production, use a proper file serving mechanism or cloud storage
    res.sendFile(filePath, (err) => {
      if (err) {
        return next(new AppError(404, 'File not found'));
      }
    });
  } catch (error) {
    next(error);
  }
};

