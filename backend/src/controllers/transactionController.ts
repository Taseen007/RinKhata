import { Response } from 'express';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get all transactions for logged in user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, loanId, walletId } = req.query;

    const filter: any = { userId: req.user._id };

    if (type) filter.type = type;
    if (loanId) filter.loanId = loanId;
    if (walletId) filter.walletId = walletId;

    const transactions = await Transaction.find(filter)
      .populate('loanId', 'personName loanType principalAmount balanceAmount')
      .populate('walletId', 'name type')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate('loanId', 'personName loanType principalAmount balanceAmount status')
      .populate('walletId', 'name type balance');

    if (!transaction) {
      res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Get recent transactions
// @route   GET /api/transactions/recent
// @access  Private
export const getRecentTransactions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const transactions = await Transaction.find({ userId: req.user._id })
      .populate('loanId', 'borrowerName')
      .populate('walletId', 'name type')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent transactions',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
