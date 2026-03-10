import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/authService'
import type { LoginCredentials, RegisterData } from '../services/authService'

// Get current user
export const useGetMe = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getMe(),
    retry: false,
  })
}

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}
