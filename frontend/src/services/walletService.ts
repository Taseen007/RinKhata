import { api } from './api'

export interface Wallet {
  _id: string
  name: string
  type: 'cash' | 'bank' | 'mfs'
  balance: number
  currency: string
  createdAt: string
  updatedAt: string
}

export interface CreateWalletData {
  name: string
  type: 'cash' | 'bank' | 'mfs'
  initialBalance?: number
  currency?: string
}

export interface UpdateWalletData {
  name?: string
  type?: 'cash' | 'bank' | 'mfs'
}

export const walletService = {
  // Get all wallets
  getWallets: async (): Promise<{ success: boolean; count: number; data: Wallet[] }> => {
    const { data } = await api.get('/wallets')
    return data
  },

  // Get single wallet
  getWallet: async (id: string): Promise<{ success: boolean; data: Wallet }> => {
    const { data } = await api.get(`/wallets/${id}`)
    return data
  },

  // Create wallet
  createWallet: async (walletData: CreateWalletData): Promise<{ success: boolean; data: Wallet }> => {
    // Map initialBalance to balance for backend
    const payload = {
      name: walletData.name,
      type: walletData.type,
      balance: walletData.initialBalance || 0,
      currency: walletData.currency || 'BDT'
    }
    const { data } = await api.post('/wallets', payload)
    return data
  },

  // Update wallet
  updateWallet: async (
    id: string,
    walletData: UpdateWalletData
  ): Promise<{ success: boolean; data: Wallet }> => {
    const { data } = await api.patch(`/wallets/${id}`, walletData)
    return data
  },

  // Delete wallet
  deleteWallet: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/wallets/${id}`)
    return data
  },
}
