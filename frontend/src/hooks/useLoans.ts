import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { loanService } from '../services/loanService'
import type { CreateLoanData, UpdateLoanData, PayLoanData } from '../services/loanService'

// Get all loans
export const useLoans = (params?: { status?: 'Active' | 'Settled'; loanType?: 'Lent' | 'Borrowed' }) => {
  return useQuery({
    queryKey: ['loans', params],
    queryFn: () => loanService.getLoans(params),
  })
}

// Get loan statistics
export const useLoanStats = () => {
  return useQuery({
    queryKey: ['loanStats'],
    queryFn: () => loanService.getLoanStats(),
  })
}

// Get single loan
export const useLoan = (id: string) => {
  return useQuery({
    queryKey: ['loan', id],
    queryFn: () => loanService.getLoan(id),
    enabled: !!id,
  })
}

// Create loan mutation
export const useCreateLoan = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (loanData: CreateLoanData) => loanService.createLoan(loanData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      queryClient.invalidateQueries({ queryKey: ['loanStats'] })
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })
}

// Update loan mutation
export const useUpdateLoan = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLoanData }) =>
      loanService.updateLoan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
    },
  })
}

// Pay loan mutation
export const usePayLoan = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PayLoanData }) =>
      loanService.payLoan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      queryClient.invalidateQueries({ queryKey: ['loanStats'] })
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

// Delete loan mutation
export const useDeleteLoan = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => loanService.deleteLoan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      queryClient.invalidateQueries({ queryKey: ['loanStats'] })
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })
}
