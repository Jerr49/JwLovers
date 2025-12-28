import { apiClient } from '@lib/api/client'
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  User,
  Profile,
} from '../types'

export const authApi = {
  // POST http://localhost:5000/api/auth/register
  register: (data: RegisterData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', data)
  },

  // POST http://localhost:5000/api/auth/login
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials)
  },

  // POST http://localhost:5000/api/auth/logout
  logout: (): Promise<{ success: boolean; message?: string }> => {
    return apiClient.post('/auth/logout')
  },

  // PATCH http://localhost:5000/api/auth/updateprofile
  updateProfile: (data: UpdateProfileData): Promise<{
    success: boolean
    data?: {
      user?: User
      profile?: Profile
    }
    message?: string
  }> => {
    return apiClient.put('/profile/update', data)
  },

  // GET http://localhost:5000/api/auth/me (if available)
  getCurrentUser: (): Promise<AuthResponse> => {
    return apiClient.get<AuthResponse>('/auth/me')
  },
}