import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  uploadFile,
  uploadMultiple,
  getFile,
  deleteFile
} from '../controllers/media.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/upload', uploadFile);
router.post('/upload-multiple', uploadMultiple);
router.get('/:id', getFile);
router.delete('/:id', deleteFile);

export default router;

