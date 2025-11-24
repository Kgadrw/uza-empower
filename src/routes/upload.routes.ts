import { Router } from 'express';
import {
  uploadFile,
  getMedia,
} from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../config/upload';

const router = Router();

router.post('/', authenticate, upload.single('file'), uploadFile);
router.get('/:id', getMedia);

export default router;

