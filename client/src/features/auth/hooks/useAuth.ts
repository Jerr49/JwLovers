import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/store/hook'
import {
  selectCurrentUser,
  selectCurrentProfile,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  register,
  login,
  logout,
  updateProfile,
  clearError,
} from '../store/authSlice'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  
  const user = useAppSelector(selectCurrentUser)
  const profile = useAppSelector(selectCurrentProfile)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isLoading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)

  const handleRegister = useCallback(async (data: any) => {
    return await dispatch(register(data)).unwrap()
  }, [dispatch])

  const handleLogin = useCallback(async (credentials: any) => {
    return await dispatch(login(credentials)).unwrap()
  }, [dispatch])

  const handleLogout = useCallback(async () => {
    return await dispatch(logout()).unwrap()
  }, [dispatch])

  const handleUpdateProfile = useCallback(async (data: any) => {
    return await dispatch(updateProfile(data)).unwrap()
  }, [dispatch])

  return {
    // State
    user,
    profile,
    isAuthenticated,
    isLoading,
    error,
    
    // Full name helper
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    
    // Profile completion
    profileCompletion: profile?.profileCompletion || 0,
    isProfileVerified: profile?.isVerified || false,
    
    // Actions
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    clearError: () => dispatch(clearError()),
  }
}