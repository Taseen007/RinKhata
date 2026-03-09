import Loan from '../models/Loan';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';
import mongoose from 'mongoose';

// Create a new loan with transaction
export const createLoanWithTransaction = async (
  userId: string,
  borrowerName: string,
  borrowerContact: string,
  totalAmount: number,
  walletId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if wallet exists and belongs to user
    const wallet = await Wallet.findOne({ _id: walletId, userId }).session(session);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Check if wallet has sufficient balance
    if (wallet.balance < totalAmount) {
      throw new Error('Insufficient wallet balance');
    }

    // Create loan
    const loan = await Loan.create(
      [
        {
          userId,
          borrowerName,
          borrowerContact,
          totalAmount,
          remainingAmount: totalAmount,
          status: 'active',
        },
      ],
      { session }
    );

    // Update wallet balance (deduct loan amount)
    wallet.balance -= totalAmount;
    await wallet.save({ session });

    // Create transaction record
    await Transaction.create(
      [
        {
          loanId: loan[0]._id,
          walletId,
          userId,
          amount: totalAmount,
          type: 'loan_given',
          note: `Loan given to ${borrowerName}`,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return loan[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Process loan payment
export const processLoanPayment = async (
  userId: string,
  loanId: string,
  paymentAmount: number,
  walletId: string,
  note: string = ''
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find loan
    const loan = await Loan.findOne({ _id: loanId, userId }).session(session);
    if (!loan) {
      throw new Error('Loan not found');
    }

    // Check if loan is already settled
    if (loan.status === 'settled') {
      throw new Error('Loan is already settled');
    }

    // Check if payment amount exceeds remaining amount
    if (paymentAmount > loan.remainingAmount) {
      throw new Error('Payment amount exceeds remaining loan amount');
    }

    // Find wallet
    const wallet = await Wallet.findOne({ _id: walletId, userId }).session(session);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Update loan remaining amount
    loan.remainingAmount -= paymentAmount;
    if (loan.remainingAmount === 0) {
      loan.status = 'settled';
    }
    await loan.save({ session });

    // Update wallet balance (add payment amount)
    wallet.balance += paymentAmount;
    await wallet.save({ session });

    // Create transaction record
    await Transaction.create(
      [
        {
          loanId: loan._id,
          walletId,
          userId,
          amount: paymentAmount,
          type: 'payment_received',
          note: note || `Payment received from ${loan.borrowerName}`,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return loan;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Get loan statistics
export const getLoanStatistics = async (userId: string) => {
  const loans = await Loan.find({ userId });

  const totalLent = loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
  const totalReceived = loans.reduce(
    (sum, loan) => sum + (loan.totalAmount - loan.remainingAmount),
    0
  );
  const totalRemaining = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const activeLoans = loans.filter((loan) => loan.status === 'active').length;
  const settledLoans = loans.filter((loan) => loan.status === 'settled').length;

  return {
    totalLent,
    totalReceived,
    totalRemaining,
    netBalance: totalReceived - totalLent,
    activeLoans,
    settledLoans,
    totalLoans: loans.length,
  };
};
