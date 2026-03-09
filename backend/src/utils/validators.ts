import { body, param, ValidationChain } from 'express-validator';

// Auth validators
export const registerValidator: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const loginValidator: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Wallet validators
export const createWalletValidator: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Wallet name is required')
    .isLength({ max: 50 })
    .withMessage('Wallet name cannot exceed 50 characters'),
  body('type')
    .notEmpty()
    .withMessage('Wallet type is required')
    .isIn(['cash', 'bank', 'mfs'])
    .withMessage('Wallet type must be cash, bank, or mfs'),
  body('balance')
    .optional()
    .isNumeric()
    .withMessage('Balance must be a number')
    .isFloat({ min: 0 })
    .withMessage('Balance cannot be negative'),
  body('currency')
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency code must be 3 characters'),
];

// Loan validators
export const createLoanValidator: ValidationChain[] = [
  body('borrowerName')
    .trim()
    .notEmpty()
    .withMessage('Borrower name is required')
    .isLength({ max: 100 })
    .withMessage('Borrower name cannot exceed 100 characters'),
  body('borrowerContact')
    .trim()
    .notEmpty()
    .withMessage('Borrower contact is required')
    .isLength({ max: 100 })
    .withMessage('Borrower contact cannot exceed 100 characters'),
  body('totalAmount')
    .notEmpty()
    .withMessage('Loan amount is required')
    .isNumeric()
    .withMessage('Loan amount must be a number')
    .isFloat({ min: 1 })
    .withMessage('Loan amount must be greater than 0'),
  body('walletId')
    .notEmpty()
    .withMessage('Wallet ID is required')
    .isMongoId()
    .withMessage('Invalid wallet ID'),
];

export const payLoanValidator: ValidationChain[] = [
  body('amount')
    .notEmpty()
    .withMessage('Payment amount is required')
    .isNumeric()
    .withMessage('Payment amount must be a number')
    .isFloat({ min: 1 })
    .withMessage('Payment amount must be greater than 0'),
  body('walletId')
    .notEmpty()
    .withMessage('Wallet ID is required')
    .isMongoId()
    .withMessage('Invalid wallet ID'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters'),
];

// MongoDB ID validator
export const mongoIdValidator: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];
