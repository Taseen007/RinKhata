import express from 'express';
import {
  getTransactions,
  getTransaction,
  getRecentTransactions,
} from '../controllers/transactionController';
import { protect } from '../middleware/authMiddleware';
import { mongoIdValidator } from '../utils/validators';

const router = express.Router();

// All routes are protected
router.use(protect);

// Recent transactions
router.get('/recent', getRecentTransactions);

// Transaction routes
router.get('/', getTransactions);
router.get('/:id', mongoIdValidator, getTransaction);

export default router;
