import { useQuery } from '@tanstack/react-query'
import { transactionService } from '../services/transactionService'

// Get all transactions
export const useTransactions = (params?: { loanId?: string }) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionService.getTransactions(params),
  })
}

// Get transactions by loan
export const useTransactionsByLoan = (loanId: string) => {
  return useQuery({
    queryKey: ['transactions', 'byLoan', loanId],
    queryFn: () => transactionService.getTransactionsByLoan(loanId),
    enabled: !!loanId,
  })
}
