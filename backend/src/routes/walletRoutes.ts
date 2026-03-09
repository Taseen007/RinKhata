import express from 'express';
import {
  getWallets,
  getWallet,
  getWalletStats,
  createWallet,
  updateWallet,
  deleteWallet,
} from '../controllers/walletController';
import { protect } from '../middleware/authMiddleware';
import { createWalletValidator, mongoIdValidator } from '../utils/validators';

const router = express.Router();

// All routes are protected
router.use(protect);

// Wallet statistics
router.get('/stats', getWalletStats);

// Wallet CRUD
router.route('/').get(getWallets).post(createWalletValidator, createWallet);

router
  .route('/:id')
  .get(mongoIdValidator, getWallet)
  .patch(mongoIdValidator, updateWallet)
  .delete(mongoIdValidator, deleteWallet);

export default router;
