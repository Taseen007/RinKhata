import jwt from 'jsonwebtoken';
import { config } from '../config/env';

// Generate JWT Token
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'BDT'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Calculate loan progress percentage
export const calculateLoanProgress = (
  totalAmount: number,
  remainingAmount: number
): number => {
  if (totalAmount === 0) return 0;
  const paidAmount = totalAmount - remainingAmount;
  return Math.round((paidAmount / totalAmount) * 100);
};

// Validate MongoDB ObjectId
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
