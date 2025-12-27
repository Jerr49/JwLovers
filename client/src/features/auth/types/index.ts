// Updated Profile interface with additional fields
export interface Profile {
  username: string
  profilePicture: {
    verified: boolean
    url?: string  
  }
  profileCompletion: number
  isVerified: boolean
  bio?: string 
  age?: number 
  location?: string  
  website?: string  
  occupation?: string  
  interests?: string[]  
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isEmailVerified: boolean
  lastLogin: string
  createdAt: string 
}

export interface AuthResponse {
  success: boolean
  token: string
  refreshToken: string
  data: {
    user: User 
    profile: Profile 
  }
  message?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  username?: string  
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  username?: string
  // Add other profile fields your backend accepts
}