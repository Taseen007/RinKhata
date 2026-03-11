import express from 'express';
import { register, login, getMe, updateMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { registerValidator, loginValidator } from '../utils/validators';

const router = express.Router();

// Public routes
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

export default router;
