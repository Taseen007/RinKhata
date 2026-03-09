import { Response } from 'express';
import { validationResult } from 'express-validator';
import Loan from '../models/Loan';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  createLoanWithTransaction,
  processLoanPayment,
  getLoanStatistics,
} from '../services/loanService';

// @desc    Get all loans for logged in user
// @route   GET /api/loans
// @access  Private
export const getLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    const filter: any = { userId: req.user._id };
    if (status) {
      filter.status = status;
    }

    const loans = await Loan.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loans',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Get loan statistics
// @route   GET /api/loans/stats
// @access  Private
export const getLoanStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats = await getLoanStatistics(req.user._id);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loan statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Get single loan
// @route   GET /api/loans/:id
// @access  Private
export const getLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!loan) {
      res.status(404).json({
        success: false,
        message: 'Loan not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loan',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Create new loan
// @route   POST /api/loans
// @access  Private
export const createLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    const { borrowerName, borrowerContact, totalAmount, walletId } = req.body;

    const loan = await createLoanWithTransaction(
      req.user._id,
      borrowerName,
      borrowerContact,
      totalAmount,
      walletId
    );

    res.status(201).json({
      success: true,
      message: 'Loan created successfully',
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error creating loan',
    });
  }
};

// @desc    Update loan
// @route   PATCH /api/loans/:id
// @access  Private
export const updateLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!loan) {
      res.status(404).json({
        success: false,
        message: 'Loan not found',
      });
      return;
    }

    const { borrowerName, borrowerContact } = req.body;

    if (borrowerName) loan.borrowerName = borrowerName;
    if (borrowerContact) loan.borrowerContact = borrowerContact;

    await loan.save();

    res.status(200).json({
      success: true,
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating loan',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Process loan payment
// @route   PATCH /api/loans/:id/pay
// @access  Private
export const payLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }

    const { amount, walletId, note } = req.body;

    const loan = await processLoanPayment(
      req.user._id,
      req.params.id,
      amount,
      walletId,
      note
    );

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error processing payment',
    });
  }
};

// @desc    Delete loan
// @route   DELETE /api/loans/:id
// @access  Private
export const deleteLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!loan) {
      res.status(404).json({
        success: false,
        message: 'Loan not found',
      });
      return;
    }

    await loan.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Loan deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting loan',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
