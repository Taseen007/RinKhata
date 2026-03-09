import mongoose, { Document, Schema } from 'mongoose';

export interface ILoan extends Document {
  userId: mongoose.Types.ObjectId;
  borrowerName: string;
  borrowerContact: string;
  totalAmount: number;
  remainingAmount: number;
  status: 'active' | 'settled';
  createdAt: Date;
}

const loanSchema = new Schema<ILoan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    borrowerName: {
      type: String,
      required: [true, 'Borrower name is required'],
      trim: true,
      maxlength: [100, 'Borrower name cannot exceed 100 characters'],
    },
    borrowerContact: {
      type: String,
      required: [true, 'Borrower contact is required'],
      trim: true,
      maxlength: [100, 'Borrower contact cannot exceed 100 characters'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Loan amount is required'],
      min: [1, 'Loan amount must be greater than 0'],
    },
    remainingAmount: {
      type: Number,
      required: [true, 'Remaining amount is required'],
      min: [0, 'Remaining amount cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'settled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
loanSchema.index({ userId: 1, status: 1, createdAt: -1 });

// Auto-update status when remainingAmount becomes 0
loanSchema.pre('save', function (next) {
  if (this.remainingAmount === 0) {
    this.status = 'settled';
  }
  next();
});

export default mongoose.model<ILoan>('Loan', loanSchema);
