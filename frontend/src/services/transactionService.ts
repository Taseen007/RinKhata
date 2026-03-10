import { api } from './api'

export interface Transaction {
  _id: string
  user: string
  loanId: {
    _id: string
    personName: string
    loanType: 'Lent' | 'Borrowed'
  }
  walletId: {
    _id: string
    name: string
    type: string
  }
  type: 'Loan' | 'Payment'
  amount: number
  note?: string
  createdAt: string
}

export const transactionService = {
  // Get all transactions
  getTransactions: async (params?: {
    loanId?: string
  }): Promise<{ success: boolean; count: number; data: Transaction[] }> => {
    const { data } = await api.get('/transactions', { params })
    return data
  },

  // Get transactions by loan
  getTransactionsByLoan: async (
    loanId: string
  ): Promise<{ success: boolean; count: number; data: Transaction[] }> => {
    const { data } = await api.get(`/transactions/${loanId}`)
    return data
  },
}
