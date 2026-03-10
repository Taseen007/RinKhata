import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { walletService } from '../services/walletService'
import type { CreateWalletData, UpdateWalletData } from '../services/walletService'

// Get all wallets
export const useWallets = () => {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: () => walletService.getWallets(),
  })
}

// Get single wallet
export const useWallet = (id: string) => {
  return useQuery({
    queryKey: ['wallet', id],
    queryFn: () => walletService.getWallet(id),
    enabled: !!id,
  })
}

// Create wallet mutation
export const useCreateWallet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (walletData: CreateWalletData) => walletService.createWallet(walletData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })
}

// Update wallet mutation
export const useUpdateWallet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWalletData }) =>
      walletService.updateWallet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })
}

// Delete wallet mutation
export const useDeleteWallet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => walletService.deleteWallet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })
}
