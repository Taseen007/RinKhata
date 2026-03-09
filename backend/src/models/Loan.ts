import mongoose, { Document, Schema } from 'mongoose';

export interface ILoan extends Document {
  userId: mongoose.Types.ObjectId;
  walletId: mongoose.Types.ObjectId;
  personName: string;
  personContact: string;
  loanType: 'Lent' | 'Borrowed';
  principalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  purposeNote?: string;
  loanDate: Date;
  dueDate?: Date;
  status: 'Active' | 'Settled';
  createdAt: Date;
}

const loanSchema = new Schema<ILoan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    walletId: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
      required: [true, 'Wallet ID is required'],
    },
    personName: {
      type: String,
      required: [true, 'Person name is required'],
      trim: true,
      maxlength: [100, 'Person name cannot exceed 100 characters'],
    },
    personContact: {
      type: String,
      required: [true, 'Person contact is required'],
      trim: true,
      maxlength: [100, 'Person contact cannot exceed 100 characters'],
    },
    loanType: {
      type: String,
      enum: {
        values: ['Lent', 'Borrowed'],
        message: '{VALUE} is not a valid loan type',
      },
      required: [true, 'Loan type is required'],
    },
    principalAmount: {
      type: Number,
      required: [true, 'Principal amount is required'],
      min: [1, 'Principal amount must be greater than 0'],
    },
    paidAmount: {
      type: Number,
      required: [true, 'Paid amount is required'],
      default: 0,
      min: [0, 'Paid amount cannot be negative'],
    },
    balanceAmount: {
      type: Number,
      required: [true, 'Balance amount is required'],
      min: [0, 'Balance amount cannot be negative'],
    },
    purposeNote: {
      type: String,
      trim: true,
      maxlength: [500, 'Purpose note cannot exceed 500 characters'],
    },
    loanDate: {
      type: Date,
      required: [true, 'Loan date is required'],
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Settled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
loanSchema.index({ userId: 1, status: 1, loanDate: -1 });

// Auto-update status when balanceAmount becomes 0
loanSchema.pre('save', function (next) {
  if (this.balanceAmount === 0) {
    this.status = 'Settled';
  } else if (this.balanceAmount > 0) {
    this.status = 'Active';
  }
  next();
});

export default mongoose.model<ILoan>('Loan', loanSchema);
