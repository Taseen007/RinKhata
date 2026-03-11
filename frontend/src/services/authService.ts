import { api } from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  data: {
    _id: string
    name: string
    email: string
    avatar?: string
    token: string
  }
}

export interface User {
  _id: string
  name: string
  email: string
  createdAt: string
  avatar?: string // Optional avatar property for user profile image
  age?: number | string
  occupation?: string
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials)
    // Backend returns token inside data.token
    if (data.data?.token) {
      localStorage.setItem('token', data.data.token)
    }
    return data
  },

  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', userData)
    // Backend returns token inside data.token
    if (data.data?.token) {
      localStorage.setItem('token', data.data.token)
    }
    return data
  },

  // Get current user
  getMe: async (): Promise<{ success: boolean; data: User }> => {
    const { data } = await api.get('/auth/me')
    return data
  },

  // Update current user profile
  updateMe: async (payload: { name: string; age?: number | string; occupation?: string; avatar?: string }) => {
    const { data } = await api.put('/auth/me', payload);
    return data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  },
}
