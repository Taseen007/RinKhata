import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler, notFound } from './middleware/errorMiddleware';

// Import routes
import authRoutes from './routes/authRoutes';
import walletRoutes from './routes/walletRoutes';
import loanRoutes from './routes/loanRoutes';
import transactionRoutes from './routes/transactionRoutes';

const app: Application = express();

// Middleware
app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'RinKhata API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      wallets: '/api/wallets',
      loans: '/api/loans',
      transactions: '/api/transactions',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
