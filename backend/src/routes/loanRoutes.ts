import express from 'express';
import {
  getLoans,
  getLoan,
  getLoanStats,
  createLoan,
  updateLoan,
  payLoan,
  deleteLoan,
} from '../controllers/loanController';
import { protect } from '../middleware/authMiddleware';
import {
  createLoanValidator,
  payLoanValidator,
  mongoIdValidator,
} from '../utils/validators';

const router = express.Router();

// All routes are protected
router.use(protect);

// Loan statistics
router.get('/stats', getLoanStats);

// Loan CRUD
router.route('/').get(getLoans).post(createLoanValidator, createLoan);

router
  .route('/:id')
  .get(mongoIdValidator, getLoan)
  .patch(mongoIdValidator, updateLoan)
  .delete(mongoIdValidator, deleteLoan);

// Payment endpoint
router.patch('/:id/pay', [...mongoIdValidator, ...payLoanValidator], payLoan);

export default router;
