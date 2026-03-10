import Loan from '../models/Loan';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';
import mongoose from 'mongoose';

// Create a new loan with transaction
export const createLoanWithTransaction = async (
  userId: string,
  personName: string,
  personContact: string,
  principalAmount: number,
  walletId: string,
  loanType: 'Lent' | 'Borrowed',
  purposeNote?: string,
  dueDate?: Date
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if wallet exists and belongs to user
    const wallet = await Wallet.findOne({ _id: walletId, userId }).session(session);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Check if wallet has sufficient balance for Lent type
    if (loanType === 'Lent' && wallet.balance < principalAmount) {
      throw new Error('Insufficient wallet balance');
    }

    // Create loan
    const loan = await Loan.create(
      [
        {
          userId,
          walletId,
          personName,
          personContact,
          loanType,
          principalAmount,
          paidAmount: 0,
          balanceAmount: principalAmount,
          purposeNote,
          loanDate: new Date(),
          dueDate,
          status: 'Active',
        },
      ],
      { session }
    );

    // Update wallet balance based on loan type
    if (loanType === 'Lent') {
      wallet.balance -= principalAmount; // Money going out
    } else {
      wallet.balance += principalAmount; // Money coming in
    }
    await wallet.save({ session });

    // Create transaction record
    await Transaction.create(
      [
        {
          loanId: loan[0]._id,
          walletId,
          userId,
          amount: principalAmount,
          type: 'Loan',
          date: new Date(),
          note: purposeNote || `Loan ${loanType.toLowerCase()} - ${personName}`,
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
    if (loan.status === 'Settled') {
      throw new Error('Loan is already settled');
    }

    // Check if payment amount exceeds remaining amount
    if (paymentAmount > loan.balanceAmount) {
      throw new Error('Payment amount exceeds remaining loan amount');
    }

    // Find wallet
    const wallet = await Wallet.findOne({ _id: walletId, userId }).session(session);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Update loan amounts
    loan.paidAmount += paymentAmount;
    loan.balanceAmount -= paymentAmount;
    if (loan.balanceAmount === 0) {
      loan.status = 'Settled';
    }
    await loan.save({ session });

    // Update wallet balance based on loan type
    if (loan.loanType === 'Lent') {
      wallet.balance += paymentAmount; // Money coming back
    } else {
      wallet.balance -= paymentAmount; // Money going out to repay
    }
    await wallet.save({ session });

    // Create transaction record
    await Transaction.create(
      [
        {
          loanId: loan._id,
          walletId,
          userId,
          amount: paymentAmount,
          type: 'Payment',
          date: new Date(),
          note: note || (loan.loanType === 'Lent' 
            ? `Received from ${loan.personName}` 
            : `Payment to ${loan.personName}`),
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

  const lentLoans = loans.filter((loan) => loan.loanType === 'Lent');
  const borrowedLoans = loans.filter((loan) => loan.loanType === 'Borrowed');

  const totalLent = lentLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
  const totalLentReceived = lentLoans.reduce((sum, loan) => sum + loan.paidAmount, 0);
  const totalLentRemaining = lentLoans.reduce((sum, loan) => sum + loan.balanceAmount, 0);

  const totalBorrowed = borrowedLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);
  const totalBorrowedPaid = borrowedLoans.reduce((sum, loan) => sum + loan.paidAmount, 0);
  const totalBorrowedRemaining = borrowedLoans.reduce((sum, loan) => sum + loan.balanceAmount, 0);

  const activeLoans = loans.filter((loan) => loan.status === 'Active').length;
  const settledLoans = loans.filter((loan) => loan.status === 'Settled').length;

  return {
    totalLent,
    totalLentReceived,
    totalLentRemaining,
    totalBorrowed,
    totalBorrowedPaid,
    totalBorrowedRemaining,
    netBalance: totalLentRemaining - totalBorrowedRemaining,
    activeLoans,
    settledLoans,
    totalLoans: loans.length,
  };
};
