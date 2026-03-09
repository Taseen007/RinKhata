import Wallet from '../models/Wallet';

// Get total balance across all wallets
export const getTotalBalance = async (userId: string): Promise<number> => {
  const wallets = await Wallet.find({ userId });
  return wallets.reduce((total, wallet) => total + wallet.balance, 0);
};

// Get wallet statistics
export const getWalletStatistics = async (userId: string) => {
  const wallets = await Wallet.find({ userId });

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const walletsByType = {
    cash: wallets.filter((w) => w.type === 'cash').length,
    bank: wallets.filter((w) => w.type === 'bank').length,
    mfs: wallets.filter((w) => w.type === 'mfs').length,
  };

  return {
    totalBalance,
    totalWallets: wallets.length,
    walletsByType,
  };
};

// Validate wallet ownership
export const validateWalletOwnership = async (
  walletId: string,
  userId: string
): Promise<boolean> => {
  const wallet = await Wallet.findOne({ _id: walletId, userId });
  return !!wallet;
};
