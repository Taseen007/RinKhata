import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'cash' | 'bank' | 'mfs';
  balance: number;
  currency: string;
  createdAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Wallet name is required'],
      trim: true,
      maxlength: [50, 'Wallet name cannot exceed 50 characters'],
    },
    type: {
      type: String,
      enum: {
        values: ['cash', 'bank', 'mfs'],
        message: '{VALUE} is not a valid wallet type',
      },
      required: [true, 'Wallet type is required'],
    },
    balance: {
      type: Number,
      required: [true, 'Initial balance is required'],
      default: 0,
      min: [0, 'Balance cannot be negative'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'BDT',
      uppercase: true,
      trim: true,
      maxlength: [3, 'Currency code must be 3 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
walletSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IWallet>('Wallet', walletSchema);
