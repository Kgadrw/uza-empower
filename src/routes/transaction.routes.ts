import { Router } from 'express';
import {
  createTransaction,
  getProjectTransactions,
  getTransactionById,
  uploadTransactionMedia,
  getProjectLedger,
  createTransactionValidation,
} from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { upload } from '../config/upload';

const router = Router();

router.post('/projects/:id/transactions', authenticate, validate(createTransactionValidation), createTransaction);
router.get('/projects/:id/transactions', authenticate, getProjectTransactions);
router.get('/transactions/:id', authenticate, getTransactionById);
router.post('/transactions/:id/media', authenticate, upload.array('media', 10), uploadTransactionMedia);
router.get('/projects/:id/ledger', authenticate, getProjectLedger);

export default router;

