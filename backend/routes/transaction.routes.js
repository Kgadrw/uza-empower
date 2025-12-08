import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} from '../controllers/transaction.controller.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', requireRole('admin'), deleteTransaction);

export default router;

