import { api } from './api'

export interface Loan {
  _id: string
  user: string
  walletId: {
    _id: string
    name: string
    type: string
    balance: number
  }
  personName: string
  personContact: string
  loanType: 'Lent' | 'Borrowed'
  principalAmount: number
  paidAmount: number
  balanceAmount: number
  status: 'Active' | 'Settled'
  purposeNote?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface LoanStats {
  success: boolean
  data: {
    totalLent: number
    totalLentReceived: number
    totalLentRemaining: number
    totalBorrowed: number
    totalBorrowedPaid: number
    totalBorrowedRemaining: number
    netBalance: number
    activeLoans: number
    settledLoans: number
    totalLoans: number
  }
}

export interface CreateLoanData {
  walletId: string
  personName: string
  personContact: string
  loanType: 'Lent' | 'Borrowed'
  principalAmount: number
  purposeNote?: string
  dueDate?: string
}

export interface UpdateLoanData {
  personName?: string
  personContact?: string
  purposeNote?: string
  dueDate?: string
}

export interface PayLoanData {
  amount: number
  walletId: string
  note?: string
}

export const loanService = {
  // Get all loans
  getLoans: async (params?: {
    status?: 'Active' | 'Settled'
    loanType?: 'Lent' | 'Borrowed'
  }): Promise<{ success: boolean; count: number; data: Loan[] }> => {
    const { data } = await api.get('/loans', { params })
    return data
  },

  // Get loan statistics
  getLoanStats: async (): Promise<LoanStats> => {
    const { data } = await api.get('/loans/stats')
    return data
  },

  // Get single loan
  getLoan: async (id: string): Promise<{ success: boolean; data: Loan }> => {
    const { data } = await api.get(`/loans/${id}`)
    return data
  },

  // Create loan
  createLoan: async (loanData: CreateLoanData): Promise<{ success: boolean; data: Loan }> => {
    const { data } = await api.post('/loans', loanData)
    return data
  },

  // Update loan
  updateLoan: async (
    id: string,
    loanData: UpdateLoanData
  ): Promise<{ success: boolean; data: Loan }> => {
    const { data } = await api.patch(`/loans/${id}`, loanData)
    return data
  },

  // Pay loan
  payLoan: async (id: string, paymentData: PayLoanData): Promise<{ success: boolean; data: Loan }> => {
    const { data } = await api.patch(`/loans/${id}/pay`, paymentData)
    return data
  },

  // Delete loan
  deleteLoan: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/loans/${id}`)
    return data
  },
}
