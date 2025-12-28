import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { AxiosError } from 'axios'
import { authApi } from '../api/auth.api'
import { LoginCredentials, RegisterData, UpdateProfileData, User, Profile } from '../types'

interface AuthState {
  user: User | null
  profile: Profile | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

// Type for API error responses
interface ApiErrorResponse {
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

// Helper function to handle API errors
const handleApiError = (error: unknown, defaultMessage: string): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>
  
  // Check for response error first
  if (axiosError.response?.data) {
    const data = axiosError.response.data
    
    if (data.message) return data.message
    if (data.error) return data.error
    
    // Handle validation errors
    if (data.errors) {
      const firstError = Object.values(data.errors)[0]
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0]
      }
      if (typeof firstError === 'string') {
        return firstError
      }
    }
  }
  
  // Check for network error
  if (axiosError.request && !axiosError.response) {
    return 'Network error. Please check your connection.'
  }
  
  // Fallback to error message or default message
  return axiosError.message || defaultMessage
}

const initialState: AuthState = {
  user: (() => {
    const userStr = localStorage.getItem('user')
    return userStr && userStr !== 'undefined' && userStr !== 'null' ? JSON.parse(userStr) : null
  })(),
  profile: (() => {
    const profileStr = localStorage.getItem('profile')
    return profileStr && profileStr !== 'undefined' && profileStr !== 'null' ? JSON.parse(profileStr) : null
  })(),
  token: (() => {
    const token = localStorage.getItem('token')
    return token && token !== 'undefined' && token !== 'null' ? token : null
  })(),
  refreshToken: (() => {
    const refreshToken = localStorage.getItem('refreshToken')
    return refreshToken && refreshToken !== 'undefined' && refreshToken !== 'null' ? refreshToken : null
  })(),
  isLoading: false,
  error: null,
  isAuthenticated: (() => {
    const token = localStorage.getItem('token')
    return !!(token && token !== 'undefined' && token !== 'null')
  })(),
}

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data)
      return response
    } catch (error) {
      const errorMessage = handleApiError(error, 'Registration failed')
      return rejectWithValue(errorMessage)
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials)
      return response
    } catch (error) {
      const errorMessage = handleApiError(error, 'Login failed')
      return rejectWithValue(errorMessage)
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout()
    } catch (error) {
      const errorMessage = handleApiError(error, 'Logout failed')
      return rejectWithValue(errorMessage)
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: UpdateProfileData, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(data)
      return response
    } catch (error) {
      const errorMessage = handleApiError(error, 'Profile update failed')
      return rejectWithValue(errorMessage)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data.user
        state.profile = action.payload.data.profile
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('refreshToken', action.payload.refreshToken)
        localStorage.setItem('user', JSON.stringify(action.payload.data.user))
        localStorage.setItem('profile', JSON.stringify(action.payload.data.profile))
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        if (typeof action.payload === 'string') {
          state.error = action.payload
        } else {
          state.error = 'Registration failed'
        }
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.data.user
        state.profile = action.payload.data.profile
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.isAuthenticated = true
        
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('refreshToken', action.payload.refreshToken)
        localStorage.setItem('user', JSON.stringify(action.payload.data.user))
        localStorage.setItem('profile', JSON.stringify(action.payload.data.profile))
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        if (typeof action.payload === 'string') {
          state.error = action.payload
        } else {
          state.error = 'Login failed'
        }
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.profile = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        localStorage.removeItem('profile')
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false
        if (typeof action.payload === 'string') {
          state.error = action.payload
        } else {
          state.error = 'Logout failed'
        }
        // Still clear local state even if server logout fails
        state.user = null
        state.profile = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        localStorage.removeItem('profile')
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload.data?.user) {
          state.user = { ...state.user, ...action.payload.data.user } as User
          localStorage.setItem('user', JSON.stringify(state.user))
        }
        if (action.payload.data?.profile) {
          state.profile = { ...state.profile, ...action.payload.data.profile } as Profile
          localStorage.setItem('profile', JSON.stringify(state.profile))
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        if (typeof action.payload === 'string') {
          state.error = action.payload
        } else {
          state.error = 'Profile update failed'
        }
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user
export const selectCurrentProfile = (state: { auth: AuthState }) => state.auth.profile
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error