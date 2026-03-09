import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';
import User from '../models/User';
import Wallet from '../models/Wallet';
import Loan from '../models/Loan';
import Transaction from '../models/Transaction';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Clear all collections
const clearDatabase = async () => {
  await User.deleteMany({});
  await Wallet.deleteMany({});
  await Loan.deleteMany({});
  await Transaction.deleteMany({});
  console.log('🗑️  Database cleared');
};

// Seed data
const seedDatabase = async () => {
  try {
    await connectDB();
    await clearDatabase();

    console.log('📦 Seeding data...');

    // 1. Create demo user (password will be auto-hashed by model pre-save hook)
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@rinkhata.com',
      password: 'password123',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
    });
    console.log('✅ User created:', user.email);

    // 2. Create wallets
    const cashWallet = await Wallet.create({
      userId: user._id,
      name: 'Cash',
      type: 'cash',
      balance: 50000,
      currency: 'BDT',
    });

    const bankWallet = await Wallet.create({
      userId: user._id,
      name: 'DBBL Bank',
      type: 'bank',
      balance: 150000,
      currency: 'BDT',
    });

    const bkashWallet = await Wallet.create({
      userId: user._id,
      name: 'bKash',
      type: 'mfs',
      balance: 25000,
      currency: 'BDT',
    });

    console.log('✅ Wallets created: Cash, Bank, MFS');

    // 3. Create loans (Active and Settled)
    
    // Active Loan 1: Lent money (You lend to someone)
    const loan1 = await Loan.create({
      userId: user._id,
      walletId: cashWallet._id,
      personName: 'Karim Ahmed',
      personContact: '+8801712345678',
      loanType: 'Lent',
      principalAmount: 10000,
      paidAmount: 4000,
      balanceAmount: 6000,
      purposeNote: 'Business startup capital',
      loanDate: new Date('2026-02-01'),
      dueDate: new Date('2026-06-01'),
      status: 'Active',
    });

    // Active Loan 2: Borrowed money (You borrow from someone)
    const loan2 = await Loan.create({
      userId: user._id,
      walletId: bankWallet._id,
      personName: 'Fatima Begum',
      personContact: '+8801887654321',
      loanType: 'Borrowed',
      principalAmount: 50000,
      paidAmount: 20000,
      balanceAmount: 30000,
      purposeNote: 'Wedding expenses',
      loanDate: new Date('2026-01-15'),
      dueDate: new Date('2026-05-15'),
      status: 'Active',
    });

    // Active Loan 3: Lent money (Partially paid)
    const loan3 = await Loan.create({
      userId: user._id,
      walletId: bkashWallet._id,
      personName: 'Rahim Khan',
      personContact: '+8801956781234',
      loanType: 'Lent',
      principalAmount: 5000,
      paidAmount: 2500,
      balanceAmount: 2500,
      purposeNote: 'Medical emergency',
      loanDate: new Date('2026-02-20'),
      dueDate: new Date('2026-04-20'),
      status: 'Active',
    });

    // Settled Loan: Fully paid
    const loan4 = await Loan.create({
      userId: user._id,
      walletId: cashWallet._id,
      personName: 'Salma Khatun',
      personContact: '+8801623456789',
      loanType: 'Borrowed',
      principalAmount: 15000,
      paidAmount: 15000,
      balanceAmount: 0,
      purposeNote: 'Laptop purchase',
      loanDate: new Date('2026-01-01'),
      dueDate: new Date('2026-03-01'),
      status: 'Settled',
    });

    console.log('✅ Loans created: 3 Active, 1 Settled');

    // 4. Create transactions for partial payments
    const transactions = [];

    // Loan 1 transactions (Karim Ahmed - Lent)
    transactions.push(
      await Transaction.create({
        userId: user._id,
        loanId: loan1._id,
        walletId: cashWallet._id,
        type: 'Payment',
        amount: 2000,
        date: new Date('2026-02-15'),
        note: 'First installment',
      })
    );

    transactions.push(
      await Transaction.create({
        userId: user._id,
        loanId: loan1._id,
        walletId: cashWallet._id,
        type: 'Payment',
        amount: 2000,
        date: new Date('2026-03-01'),
        note: 'Second installment',
      })
    );

    // Loan 2 transactions (Fatima Begum - Borrowed)
    transactions.push(
      await Transaction.create({
        userId: user._id,
        loanId: loan2._id,
        walletId: bankWallet._id,
        type: 'Payment',
        amount: 10000,
        date: new Date('2026-02-01'),
        note: 'First payment',
      })
    );

    transactions.push(
      await Transaction.create({
        userId: user._id,
        loanId: loan2._id,
        walletId: bankWallet._id,
        type: 'Payment',
        amount: 10000,
        date: new Date('2026-02-28'),
        note: 'Second payment',
      })
    );

    // Loan 3 transactions (Rahim Khan - Lent)
    transactions.push(
      await Transaction.create({
        userId: user._id,
        loanId: loan3._id,
        walletId: bkashWallet._id,
        type: 'Payment',
        amount: 2500,
        date: new Date('2026-03-05'),
        note: 'Half payment received',
      })
    );

    // Loan 4 transactions (Salma Khatun - Settled)
    transactions.push(
      await Transaction.create({
        userId: user._id,
        loanId: loan4._id,
        walletId: cashWallet._id,
        type: 'Payment',
        amount: 15000,
        date: new Date('2026-03-01'),
        note: 'Full payment completed',
      })
    );

    console.log('✅ Transactions created:', transactions.length);

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log('   - Users: 1');
    console.log('   - Wallets: 3 (Cash, Bank, MFS)');
    console.log('   - Loans: 4 (3 Active, 1 Settled)');
    console.log('   - Transactions: 6');
    console.log('\n🔐 Demo Login Credentials:');
    console.log('   Email: demo@rinkhata.com');
    console.log('   Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
