import { Response } from 'express';
import { validationResult } from 'express-validator';
import Wallet from '../models/Wallet';
import { AuthRequest } from '../middleware/authMiddleware';
import { getWalletStatistics } from '../services/walletService';

// @desc    Get all wallets for logged in user
// @route   GET /api/wallets
// @access  Private
export const getWallets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const wallets = await Wallet.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: wallets.length,
      data: wallets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching wallets',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Get wallet statistics
// @route   GET /api/wallets/stats
// @access  Private
export const getWalletStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats = await getWalletStatistics(req.user._id);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching wallet statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Get single wallet
// @route   GET /api/wallets/:id
// @access  Private
export const getWallet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const wallet = await Wallet.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!wallet) {
      res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching wallet',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Create new wallet
// @route   POST /api/wallets
// @access  Private
export const createWallet = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { name, type, balance, currency } = req.body;

    const wallet = await Wallet.create({
      userId: req.user._id,
      name,
      type,
      balance: balance || 0,
      currency: currency || 'BDT',
    });

    res.status(201).json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating wallet',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Update wallet
// @route   PATCH /api/wallets/:id
// @access  Private
export const updateWallet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const wallet = await Wallet.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!wallet) {
      res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
      return;
    }

    const { name, balance } = req.body;

    if (name) wallet.name = name;
    if (balance !== undefined) wallet.balance = balance;

    await wallet.save();

    res.status(200).json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating wallet',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Delete wallet
// @route   DELETE /api/wallets/:id
// @access  Private
export const deleteWallet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const wallet = await Wallet.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!wallet) {
      res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
      return;
    }

    await wallet.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Wallet deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting wallet',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
