import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const DashboardPage: React.FC = () => {
  const { user, profile, fullName, profileCompletion, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleUpdateProfile = () => {
    navigate('/profile/edit')
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login first</p>
          <a href="/login" className="btn-primary">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">JWLovers</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{fullName}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-brand-600">
                    {user.firstName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome back, {user.firstName || 'User'}! 👋
                  </h2>
                  <p className="text-gray-600">
                    {profile?.username ? `@${profile.username}` : 'Complete your profile to get better matches'}
                  </p>
                  {profile?.profileCompletion && (
                    <div className="flex items-center mt-2">
                      <div className="text-sm text-gray-500">
                        Profile {profile.profileCompletion}% complete
                      </div>
                      {profile.isVerified && (
                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Your Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                </div>
                {profile?.username && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Username</p>
                    <p className="text-lg font-semibold text-gray-900">@{profile.username}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Status</p>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${user.isEmailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>
                </div>
                {user.lastLogin && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Login</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </p>
                  </div>
                )}
               
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={handleUpdateProfile}
                  className="w-full btn-primary"
                >
                  Update Profile
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  View Profile
                </button>
                {!user.isEmailVerified && (
                  <button
                    onClick={() => navigate('/verify-email')}
                    className="w-full px-4 py-3 border border-yellow-300 text-yellow-600 rounded-lg font-medium hover:bg-yellow-50 transition"
                  >
                    Verify Email
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Profile Strength</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {profileCompletion}% Complete
                    </span>
                    <span className="text-sm font-medium text-brand-600">
                      {profileCompletion}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${user.isEmailVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Email Verification</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${profile?.isVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Profile Verification</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${profile?.username ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Username Set</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Complete your profile to increase match chances by 5x
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage