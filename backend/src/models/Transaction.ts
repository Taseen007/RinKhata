import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  loanId: mongoose.Types.ObjectId;
  walletId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: 'loan_given' | 'payment_received';
  note?: string;
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    loanId: {
      type: Schema.Types.ObjectId,
      ref: 'Loan',
      required: [true, 'Loan ID is required'],
    },
    walletId: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
      required: [true, 'Wallet ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
      min: [1, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: {
        values: ['loan_given', 'payment_received'],
        message: '{VALUE} is not a valid transaction type',
      },
      required: [true, 'Transaction type is required'],
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ loanId: 1, createdAt: -1 });
transactionSchema.index({ walletId: 1, createdAt: -1 });

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
